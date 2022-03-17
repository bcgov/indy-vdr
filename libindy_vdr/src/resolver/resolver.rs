use futures_executor::block_on;
use serde_json::Value as SJsonValue;

use super::did::DidUrl;
use super::did_document::{DidDocument, LEGACY_INDY_SERVICE};
use super::utils::*;

use crate::common::error::prelude::*;
use crate::ledger::responses::{Endpoint, GetNymResultV1};

use crate::ledger::{constants, RequestBuilder};
use crate::pool::helpers::perform_ledger_request;
use crate::pool::{Pool, PoolRunner, PreparedRequest, RequestResult, TimingResult};
use crate::utils::did::DidValue;

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub enum Result {
    DidDocument(DidDocument),
    Content(SJsonValue),
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub enum Metadata {
    DidDocumentMetadata(DidDocumentMetadata),
    ContentMetadata(ContentMetadata),
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ContentMetadata {
    pub node_response: SJsonValue,
    pub object_type: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DidDocumentMetadata {
    pub node_response: SJsonValue,
    pub object_type: String,
    pub self_certification_version: Option<i32>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ResolutionResult {
    pub did_resolution_metadata: Option<String>,
    pub did_document: Option<SJsonValue>,
    pub did_document_metadata: Option<DidDocumentMetadata>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DereferencingResult {
    pub dereferencing_metadata: Option<String>,
    pub content_stream: Option<SJsonValue>,
    pub content_metadata: Option<ContentMetadata>,
}

/// DID (URL) Resolver interface for a pool compliant with did:indy method spec
pub struct PoolResolver<T: Pool> {
    pool: T,
}

impl<T: Pool> PoolResolver<T> {
    pub fn new(pool: T) -> PoolResolver<T> {
        PoolResolver { pool }
    }

    /// Dereference a DID Url and return a serialized `DereferencingResult`
    pub fn dereference(&self, did_url: &str) -> VdrResult<String> {
        debug!("PoolResolver: Dereference DID Url {}", did_url);
        let (data, metadata) = self._resolve(did_url)?;

        let content = match data {
            Result::Content(c) => Some(c),
            _ => None,
        };

        let md = if let Metadata::ContentMetadata(md) = metadata {
            Some(md)
        } else {
            None
        };

        let result = DereferencingResult {
            dereferencing_metadata: None,
            content_stream: content,
            content_metadata: md,
        };

        Ok(serde_json::to_string_pretty(&result).unwrap())
    }

    /// Resolve a DID and return a serialized `ResolutionResult`
    pub fn resolve(&self, did: &str) -> VdrResult<String> {
        debug!("PoolResolver: Resolve DID {}", did);
        let (data, metadata) = self._resolve(did)?;

        let diddoc = match data {
            Result::DidDocument(doc) => Some(doc.to_value()?),
            _ => None,
        };

        let md = if let Metadata::DidDocumentMetadata(md) = metadata {
            Some(md)
        } else {
            None
        };

        let result = ResolutionResult {
            did_resolution_metadata: None,
            did_document: diddoc,
            did_document_metadata: md,
        };

        Ok(serde_json::to_string_pretty(&result).unwrap())
    }

    // Internal method to resolve and dereference
    fn _resolve(&self, did: &str) -> VdrResult<(Result, Metadata)> {
        let did_url = DidUrl::from_str(did)?;

        let builder = self.pool.get_request_builder();
        let request = build_request(&did_url, &builder)?;

        let ledger_data = self.handle_request(&request)?;
        let data = parse_ledger_data(&ledger_data)?;

        let (result, metadata) = match request.txn_type.as_str() {
            constants::GET_NYM => {
                let get_nym_result: GetNymResultV1 =
                    serde_json::from_str(data.as_str().unwrap())
                        .map_err(|_| err_msg(VdrErrorKind::Resolver, "Could not parse NYM data"))?;

                let endpoint: Option<Endpoint> = if get_nym_result.diddoc_content.is_none() {
                    // Legacy: Try to find an attached ATTRIBUTE transacation with raw endpoint
                    self.fetch_legacy_endpoint(&did_url.id).ok()
                } else {
                    None
                };

                let did_document = DidDocument::new(
                    &did_url.namespace,
                    &get_nym_result.dest,
                    &get_nym_result.verkey,
                    endpoint,
                    None,
                );

                let metadata = Metadata::DidDocumentMetadata(DidDocumentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("NYM"),
                    self_certification_version: get_nym_result.version,
                });

                (Result::DidDocument(did_document), metadata)
            }
            constants::GET_CRED_DEF => (
                Result::Content(data),
                Metadata::ContentMetadata(ContentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("CRED_DEF"),
                }),
            ),
            constants::GET_SCHEMA => (
                Result::Content(data),
                Metadata::ContentMetadata(ContentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("SCHEMA"),
                }),
            ),
            constants::GET_REVOC_REG_DEF => (
                Result::Content(data),
                Metadata::ContentMetadata(ContentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("REVOC_REG_DEF"),
                }),
            ),
            constants::GET_REVOC_REG_DELTA => (
                Result::Content(data),
                Metadata::ContentMetadata(ContentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("REVOC_REG_DELTA"),
                }),
            ),
            _ => (
                Result::Content(data),
                Metadata::ContentMetadata(ContentMetadata {
                    node_response: serde_json::from_str(&ledger_data).unwrap(),
                    object_type: String::from("REVOC_REG_DELTA"),
                }),
            ),
        };

        let result_with_metadata = (result, metadata);

        Ok(result_with_metadata)
    }

    fn fetch_legacy_endpoint(&self, did: &DidValue) -> VdrResult<Endpoint> {
        let builder = self.pool.get_request_builder();
        let request = builder.build_get_attrib_request(
            None,
            did,
            Some(String::from(LEGACY_INDY_SERVICE)),
            None,
            None,
        )?;
        let ledger_data = self.handle_request(&request)?;
        let endpoint_data = parse_ledger_data(&ledger_data)?;
        let endpoint_data: Endpoint = serde_json::from_str(endpoint_data.as_str().unwrap())
            .map_err(|_| err_msg(VdrErrorKind::Resolver, "Could not parse endpoint data"))?;
        Ok(endpoint_data)
    }

    fn handle_request(&self, request: &PreparedRequest) -> VdrResult<String> {
        let (result, _timing) = block_on(self.request_transaction(&request))?;
        match result {
            RequestResult::Reply(data) => Ok(data),
            RequestResult::Failed(error) => Err(error),
        }
    }

    async fn request_transaction(
        &self,
        request: &PreparedRequest,
    ) -> VdrResult<(RequestResult<String>, Option<TimingResult>)> {
        perform_ledger_request(&self.pool, &request).await
    }
}

/// DID (URL) Resolver interface using callbacks for a PoolRunner compliant with did:indy method spec
pub struct PoolRunnerResolver<'a> {
    runner: &'a PoolRunner,
}

impl<'a> PoolRunnerResolver<'a> {
    pub fn new(runner: &'a PoolRunner) -> PoolRunnerResolver {
        PoolRunnerResolver { runner }
    }

    /// Dereference a DID Url and return a serialized `DereferencingResult`
    pub fn dereference(
        &self,
        did_url: &str,
        callback: Callback<VdrResult<String>>,
    ) -> VdrResult<()> {
        self._resolve(
            did_url,
            Box::new(move |result| {
                let (data, metadata) = result.unwrap();
                let content = match data {
                    Result::Content(c) => Some(c),
                    _ => None,
                };

                let md = if let Metadata::ContentMetadata(md) = metadata {
                    Some(md)
                } else {
                    None
                };

                let result = DereferencingResult {
                    dereferencing_metadata: None,
                    content_stream: content,
                    content_metadata: md,
                };

                callback(Ok(serde_json::to_string_pretty(&result).unwrap()))
            }),
        )
    }

    /// Resolve a DID and return a serialized `ResolutionResult`
    pub fn resolve(&self, did: &str, callback: Callback<VdrResult<String>>) -> VdrResult<()> {
        self._resolve(
            did,
            Box::new(move |result| {
                let (data, metadata) = result.unwrap();
                let diddoc = match data {
                    Result::DidDocument(doc) => Some(doc.to_value().unwrap()),
                    _ => None,
                };

                let md = if let Metadata::DidDocumentMetadata(md) = metadata {
                    Some(md)
                } else {
                    None
                };

                let result = ResolutionResult {
                    did_resolution_metadata: None,
                    did_document: diddoc,
                    did_document_metadata: md,
                };

                callback(Ok(serde_json::to_string_pretty(&result).unwrap()))
            }),
        )
    }

    // TODO: Refactor
    // TODO: Adapt according to PoolResolver.
    fn _resolve(
        &self,
        did: &str,
        callback: Callback<VdrResult<(Result, Metadata)>>,
    ) -> VdrResult<()> {
        let did_url = DidUrl::from_str(did)?;

        let builder = RequestBuilder::default();
        let request = build_request(&did_url, &builder)?;
        let txn_type = request.txn_type.clone();
        self.runner.send_request(
            request,
            Box::new(
                move |result: VdrResult<(RequestResult<String>, Option<TimingResult>)>| {
                    match result {
                        Ok((reply, _)) => {
                            match reply {
                                RequestResult::Reply(reply_data) => {
                                    let data = parse_ledger_data(&reply_data).unwrap();
                                    if txn_type.as_str() == constants::GET_NYM {
                                        let get_nym_result: GetNymResultV1 =
                                            serde_json::from_str(data.as_str().unwrap()).unwrap();

                                        // TODO: Fix fetch_legacy_endpoint
                                        // let did = did_url.id.clone();
                                        if get_nym_result.diddoc_content.is_none() {
                                            // Legacy: Try to find an attached ATTRIBUTE transacation with raw endpoint
                                            // self._fetch_legacy_endpoint(
                                            //     &did,
                                            //     Box::new(move |result| {
                                            //         let did_document = DidDocument::new(
                                            //             &did_url.namespace,
                                            //             &get_nym_result.dest,
                                            //             &get_nym_result.verkey,
                                            //             result.ok(),
                                            //             None,
                                            //         );

                                            //         let metadata = ContentMetadata {
                                            //             node_response: serde_json::from_str(
                                            //                 &reply_data,
                                            //             )
                                            //             .unwrap(),
                                            //             object_type: String::from("NYM"),
                                            //         };

                                            //         let result =
                                            //             Some(Result::DidDocument(did_document));

                                            //         let result_with_metadata =
                                            //             (result.unwrap(), metadata);
                                            //         callback(Ok(result_with_metadata));
                                            //     }),
                                            // );
                                        }

                                        let did_document = DidDocument::new(
                                            &did_url.namespace,
                                            &get_nym_result.dest,
                                            &get_nym_result.verkey,
                                            None,
                                            None,
                                        );

                                        let metadata =
                                            Metadata::DidDocumentMetadata(DidDocumentMetadata {
                                                node_response: serde_json::from_str(&reply_data)
                                                    .unwrap(),
                                                object_type: String::from("NYM"),
                                                self_certification_version: get_nym_result.version,
                                            });

                                        let result = Some(Result::DidDocument(did_document));

                                        let result_with_metadata = (result.unwrap(), metadata);
                                        callback(Ok(result_with_metadata));
                                    } else {
                                        let (result, metadata) = match txn_type.as_str() {
                                            constants::GET_CRED_DEF => (
                                                Result::Content(data),
                                                Metadata::ContentMetadata(ContentMetadata {
                                                    node_response: serde_json::from_str(
                                                        &reply_data,
                                                    )
                                                    .unwrap(),
                                                    object_type: String::from("CRED_DEF"),
                                                }),
                                            ),
                                            constants::GET_SCHEMA => (
                                                Result::Content(data),
                                                Metadata::ContentMetadata(ContentMetadata {
                                                    node_response: serde_json::from_str(
                                                        &reply_data,
                                                    )
                                                    .unwrap(),
                                                    object_type: String::from("SCHEMA"),
                                                }),
                                            ),
                                            constants::GET_REVOC_REG_DEF => (
                                                Result::Content(data),
                                                Metadata::ContentMetadata(ContentMetadata {
                                                    node_response: serde_json::from_str(
                                                        &reply_data,
                                                    )
                                                    .unwrap(),
                                                    object_type: String::from("REVOC_REG_DEF"),
                                                }),
                                            ),
                                            constants::GET_REVOC_REG_DELTA => (
                                                Result::Content(data),
                                                Metadata::ContentMetadata(ContentMetadata {
                                                    node_response: serde_json::from_str(
                                                        &reply_data,
                                                    )
                                                    .unwrap(),
                                                    object_type: String::from("REVOC_REG_DELTA"),
                                                }),
                                            ),
                                            _ => (
                                                Result::Content(data),
                                                Metadata::ContentMetadata(ContentMetadata {
                                                    node_response: serde_json::from_str(
                                                        &reply_data,
                                                    )
                                                    .unwrap(),
                                                    object_type: String::from("REVOC_REG_DELTA"),
                                                }),
                                            ),
                                        };

                                        let result_with_metadata = (result, metadata);
                                        callback(Ok(result_with_metadata));
                                    }
                                }
                                RequestResult::Failed(err) => callback(Err(err)),
                            }
                        }
                        Err(err) => callback(Err(err)),
                    }
                },
            ),
        )
    }

    fn _fetch_legacy_endpoint(
        &self,
        did: &DidValue,
        callback: Callback<VdrResult<Endpoint>>,
    ) -> VdrResult<()> {
        let builder = RequestBuilder::default();
        let request = builder.build_get_attrib_request(
            None,
            did,
            Some(String::from(LEGACY_INDY_SERVICE)),
            None,
            None,
        )?;
        self.runner.send_request(
            request,
            Box::new(move |result| match result {
                Ok((res, _)) => match res {
                    RequestResult::Reply(reply_data) => {
                        let endpoint_data = parse_ledger_data(&reply_data).unwrap();
                        let endpoint_data: Endpoint =
                            serde_json::from_str(endpoint_data.as_str().unwrap()).unwrap();
                        callback(Ok(endpoint_data));
                    }
                    RequestResult::Failed(err) => callback(Err(err)),
                },
                Err(err) => callback(Err(err)),
            }),
        )
    }
}

type Callback<R> = Box<dyn (FnOnce(R) -> ()) + Send>;

#[cfg(test)]
mod tests {

    use urlencoding::encode;

    use time::format_description::well_known::Rfc3339;
    use time::OffsetDateTime;

    use super::*;
    use rstest::*;

    use crate::pool::ProtocolVersion;

    #[fixture]
    fn request_builder() -> RequestBuilder {
        RequestBuilder::new(ProtocolVersion::Node1_4)
    }

    #[rstest]
    fn build_get_revoc_reg_request_from_version_time(request_builder: RequestBuilder) {
        let datetime_as_str = "2020-12-20T19:17:47Z";
        let did_url_as_str = format!("did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_ENTRY/104/revocable/a4e25e54?versionTime={}",datetime_as_str);
        let did_url = DidUrl::from_str(&did_url_as_str).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();
        let timestamp = (*(request.req_json).get("operation").unwrap())
            .get("timestamp")
            .unwrap()
            .as_u64()
            .unwrap() as i64;
        assert_eq!(constants::GET_REVOC_REG, request.txn_type);

        assert_eq!(
            OffsetDateTime::parse(datetime_as_str, &Rfc3339)
                .unwrap()
                .unix_timestamp(),
            timestamp
        );
    }

    #[rstest]
    fn build_get_revoc_reg_without_version_time(request_builder: RequestBuilder) {
        let now = OffsetDateTime::now_utc().unix_timestamp();

        let did_url_as_str = "did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_ENTRY/104/revocable/a4e25e54";
        let did_url = DidUrl::from_str(did_url_as_str).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();
        let timestamp = (*(request.req_json).get("operation").unwrap())
            .get("timestamp")
            .unwrap()
            .as_u64()
            .unwrap() as i64;

        assert_eq!(constants::GET_REVOC_REG, request.txn_type);
        assert!(timestamp >= now);
    }

    #[rstest]
    fn build_get_revoc_reg_request_fails_with_unparsable_version_time(
        request_builder: RequestBuilder,
    ) {
        let datetime_as_str = "20201220T19:17:47Z";
        let did_url_as_str = format!("did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_ENTRY/104/revocable/a4e25e54?versionTime={}",datetime_as_str);
        let did_url = DidUrl::from_str(&did_url_as_str).unwrap();
        let _err = build_request(&did_url, &request_builder).unwrap_err();
    }

    #[rstest]
    fn build_get_revoc_reg_delta_request_with_from_to(request_builder: RequestBuilder) {
        let from_as_str = "2019-12-20T19:17:47Z";
        let to_as_str = "2020-12-20T19:17:47Z";
        let did_url_as_str = format!("did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_ENTRY/104/revocable/a4e25e54?from={}&to={}",from_as_str, to_as_str);
        let did_url = DidUrl::from_str(&did_url_as_str).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();
        assert_eq!(request.txn_type, constants::GET_REVOC_REG_DELTA);
    }

    #[rstest]
    fn build_get_revoc_reg_delta_request_with_from_only(request_builder: RequestBuilder) {
        let now = OffsetDateTime::now_utc().unix_timestamp();
        let from_as_str = "2019-12-20T19:17:47Z";
        let did_url_as_str = format!("did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_ENTRY/104/revocable/a4e25e54?from={}",from_as_str);
        let did_url = DidUrl::from_str(&did_url_as_str).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();

        let to = (*(request.req_json).get("operation").unwrap())
            .get("to")
            .unwrap()
            .as_u64()
            .unwrap() as i64;
        assert_eq!(request.txn_type, constants::GET_REVOC_REG_DELTA);
        assert!(to >= now)
    }

    #[rstest]
    fn build_get_revoc_reg_delta_request_without_parameter(request_builder: RequestBuilder) {
        let now = OffsetDateTime::now_utc().unix_timestamp();
        let did_url_as_str = "did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/REV_REG_DELTA/104/revocable/a4e25e54";
        let did_url = DidUrl::from_str(did_url_as_str).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();

        let to = (*(request.req_json).get("operation").unwrap())
            .get("to")
            .unwrap()
            .as_u64()
            .unwrap() as i64;

        let from = (*(request.req_json).get("operation").unwrap()).get("from");
        assert_eq!(request.txn_type, constants::GET_REVOC_REG_DELTA);
        assert!(from.is_none());
        assert!(to >= now);
    }

    #[rstest]
    fn build_get_schema_request_with_whitespace(request_builder: RequestBuilder) {
        let name = "My Schema";
        let encoded_schema_name = encode(name).to_string();
        let did_url_string = format!(
            "did:indy:idunion:Dk1fRRTtNazyMuK2cr64wp/anoncreds/v0/SCHEMA/{}/1.0",
            encoded_schema_name
        );

        let did_url = DidUrl::from_str(did_url_string.as_str()).unwrap();
        let request = build_request(&did_url, &request_builder).unwrap();
        let schema_name = (*(request.req_json).get("operation").unwrap())
            .get("data")
            .and_then(|v| v.get("name"))
            .and_then(|v| v.as_str())
            .unwrap();
        assert_eq!(schema_name, name);
    }
}
