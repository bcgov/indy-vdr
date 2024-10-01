#include "indyVdr.h"

using namespace indyVdrTurboModuleUtility;

namespace indyVdr {

jsi::Value version(jsi::Runtime &rt, jsi::Object options) {
  return jsi::String::createFromAscii(rt, indy_vdr_version());
}

jsi::Value getCurrentError(jsi::Runtime &rt, jsi::Object options) {
  const char *out;

  indy_vdr_get_current_error(&out);

  return jsi::String::createFromAscii(rt, out);
};

jsi::Value setConfig(jsi::Runtime &rt, jsi::Object options) {
  auto config = jsiToValue<std::string>(rt, options, "config");

  ErrorCode code = indy_vdr_set_config(config.c_str());

  return createReturnValue(rt, code, nullptr);
};

jsi::Value setCacheDirectory(jsi::Runtime &rt, jsi::Object options) {
  auto path = jsiToValue<std::string>(rt, options, "path");

  ErrorCode code = indy_vdr_set_cache_directory(path.c_str());

  return createReturnValue(rt, code, nullptr);
};

jsi::Value setLedgerTxnCache(jsi::Runtime &rt, jsi::Object options) {
  auto capacity = jsiToValue<int32_t>(rt, options, "capacity");
  auto expiry_offset_ms = jsiToValue<int64_t>(rt, options, "expiry_offset_ms");
  auto path = jsiToValue<std::string>(rt, options, "path", true);

  ErrorCode code = indy_vdr_set_ledger_txn_cache(capacity, expiry_offset_ms, path.length() > 0 ? path.c_str() : nullptr);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value setDefaultLogger(jsi::Runtime &rt, jsi::Object options) {
  ErrorCode code = indy_vdr_set_default_logger();

  return createReturnValue(rt, code, nullptr);
};

jsi::Value setProtocolVersion(jsi::Runtime &rt, jsi::Object options) {
  auto version = jsiToValue<int64_t>(rt, options, "version");

  ErrorCode code = indy_vdr_set_protocol_version(version);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value setSocksProxy(jsi::Runtime &rt, jsi::Object options) {
  auto socksProxy = jsiToValue<std::string>(rt, options, "socksProxy");

  ErrorCode code = indy_vdr_set_socks_proxy(socksProxy.c_str());

  return createReturnValue(rt, code, nullptr);
};

jsi::Value buildAcceptanceMechanismsRequest(jsi::Runtime &rt,
                                            jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto aml = jsiToValue<std::string>(rt, options, "aml");
  auto version = jsiToValue<std::string>(rt, options, "version");
  auto amlContext = jsiToValue<std::string>(rt, options, "amlContext", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_acceptance_mechanisms_request(
      submitterDid.c_str(), aml.c_str(), version.c_str(),
      amlContext.length() ? amlContext.c_str() : nullptr, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetAcceptanceMechanismsRequest(jsi::Runtime &rt,
                                               jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto timestamp = jsiToValue<int64_t>(rt, options, "timestamp", true);
  auto version = jsiToValue<std::string>(rt, options, "version", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_acceptance_mechanisms_request(
      submitterDid.c_str(), timestamp,
      version.length() > 0 ? version.c_str() : nullptr, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildAttribRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto targetDid = jsiToValue<std::string>(rt, options, "targetDid");
  auto hash = jsiToValue<std::string>(rt, options, "hash", true);
  auto raw = jsiToValue<std::string>(rt, options, "raw", true);
  auto enc = jsiToValue<std::string>(rt, options, "enc", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_attrib_request(
      submitterDid.c_str(), targetDid.c_str(),
      hash.length() > 0 ? hash.c_str() : nullptr,
      raw.length() > 0 ? raw.c_str() : nullptr,
      enc.length() > 0 ? enc.c_str() : nullptr, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetAttribRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto targetDid = jsiToValue<std::string>(rt, options, "targetDid");
  auto hash = jsiToValue<std::string>(rt, options, "hash", true);
  auto raw = jsiToValue<std::string>(rt, options, "raw", true);
  auto enc = jsiToValue<std::string>(rt, options, "enc", true);
  auto seqNo = jsiToValue<int32_t>(rt, options, "seqNo", true);
  auto timestamp = jsiToValue<int64_t>(rt, options, "timestamp", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_attrib_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      targetDid.c_str(),
      raw.length() > 0 ? raw.c_str() : nullptr,
      hash.length() > 0 ? hash.c_str() : nullptr,
      enc.length() > 0 ? enc.c_str() : nullptr, 
      seqNo, timestamp, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildCredDefRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto credentialDefinition =
      jsiToValue<std::string>(rt, options, "credentialDefinition");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_cred_def_request(
      submitterDid.c_str(), credentialDefinition.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetCredDefRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto credentialDefinitionId =
      jsiToValue<std::string>(rt, options, "credentialDefinitionId");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_cred_def_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      credentialDefinitionId.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetRevocRegDefRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto revocationRegistryId = jsiToValue<std::string>(rt, options, "revocationRegistryId");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_revoc_reg_def_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      revocationRegistryId.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetRevocRegRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto revocationRegistryId = jsiToValue<std::string>(rt, options, "revocationRegistryId");
  auto timestamp = jsiToValue<int64_t>(rt, options, "timestamp");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_revoc_reg_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      revocationRegistryId.c_str(), timestamp, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetRevocRegDeltaRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto revocationRegistryId = jsiToValue<std::string>(rt, options, "revocationRegistryId");
  auto fromTs = jsiToValue<int64_t>(rt, options, "fromTs", true);
  auto toTs = jsiToValue<int64_t>(rt, options, "toTs");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_revoc_reg_delta_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      revocationRegistryId.c_str(), fromTs, toTs, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildRevocRegDefRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto revocationRegistryId = jsiToValue<std::string>(rt, options, "revocationRegistryId");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_revoc_reg_def_request(
      submitterDid.c_str(), revocationRegistryId.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildCustomRequest(jsi::Runtime &rt, jsi::Object options) {
  auto requestJson = jsiToValue<std::string>(rt, options, "customRequest");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_custom_request(requestJson.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildDisableAllTxnAuthorAgreementsRequest(jsi::Runtime &rt,
                                                     jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_disable_all_txn_author_agreements_request(
      submitterDid.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetNymRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto dest = jsiToValue<std::string>(rt, options, "dest");
  auto seqNo = jsiToValue<int32_t>(rt, options, "seqNo", true);
  auto timestamp = jsiToValue<int64_t>(rt, options, "timestamp", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_nym_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr, dest.c_str(),
      seqNo, timestamp, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetSchemaRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto schemaId = jsiToValue<std::string>(rt, options, "schemaId");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_schema_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      schemaId.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetTxnAuthorAgreementRequest(jsi::Runtime &rt,
                                             jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto data = jsiToValue<std::string>(rt, options, "data", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_txn_author_agreement_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr,
      data.length() > 0 ? data.c_str() : nullptr, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetTxnRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid =
      jsiToValue<std::string>(rt, options, "submitterDid", true);
  auto ledgerType = jsiToValue<int32_t>(rt, options, "ledgerType");
  auto seqNo = jsiToValue<int32_t>(rt, options, "seqNo");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_get_txn_request(
      submitterDid.length() > 0 ? submitterDid.c_str() : nullptr, ledgerType,
      seqNo, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildGetValidatorInfoRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");

  RequestHandle out;

  ErrorCode code =
      indy_vdr_build_get_validator_info_request(submitterDid.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildNymRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto dest = jsiToValue<std::string>(rt, options, "dest");
  auto verkey = jsiToValue<std::string>(rt, options, "verkey", true);
  auto alias = jsiToValue<std::string>(rt, options, "alias", true);
  auto role = jsiToValue<std::string>(rt, options, "role", true);
  auto diddocContent = jsiToValue<std::string>(rt, options, "diddocContent", true);
  auto version = jsiToValue<int32_t>(rt, options, "version");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_nym_request(
      submitterDid.c_str(), dest.c_str(),
      verkey.length() > 0 ? verkey.c_str() : nullptr,
      alias.length() > 0 ? alias.c_str() : nullptr,
      role.length() > 0 ? role.c_str() : nullptr, 
      diddocContent.length() > 0 ? diddocContent.c_str() : nullptr, 
      version, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildRevocRegEntryRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto revocRegDefId = jsiToValue<std::string>(rt, options, "revocRegDefId");
  auto revocRegDefType =
      jsiToValue<std::string>(rt, options, "revocRegDefType");
  auto revocRegEntry = jsiToValue<std::string>(rt, options, "revocRegEntry");

  RequestHandle out;

  ErrorCode code = indy_vdr_build_revoc_reg_entry_request(
      submitterDid.c_str(), revocRegDefId.c_str(), revocRegDefType.c_str(),
      revocRegEntry.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildSchemaRequest(jsi::Runtime &rt, jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto schema = jsiToValue<std::string>(rt, options, "schema");

  RequestHandle out;

  ErrorCode code =
      indy_vdr_build_schema_request(submitterDid.c_str(), schema.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value buildTxnAuthorAgreementRequest(jsi::Runtime &rt,
                                          jsi::Object options) {
  auto submitterDid = jsiToValue<std::string>(rt, options, "submitterDid");
  auto text = jsiToValue<std::string>(rt, options, "text", true);
  auto version = jsiToValue<std::string>(rt, options, "version");
  auto ratificationTs =
      jsiToValue<int64_t>(rt, options, "ratificationTs", true);
  auto retirementTs = jsiToValue<int64_t>(rt, options, "retirementTs", true);

  RequestHandle out;

  ErrorCode code = indy_vdr_build_txn_author_agreement_request(
      submitterDid.c_str(), text.length() > 0 ? text.c_str() : nullptr,
      version.c_str(), ratificationTs, retirementTs, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value poolCreate(jsi::Runtime &rt, jsi::Object options) {
  auto params = jsiToValue<std::string>(rt, options, "parameters");

  PoolHandle out;
  ErrorCode code = indy_vdr_pool_create(params.c_str(), &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value poolRefresh(jsi::Runtime &rt, jsi::Object options) {
  auto poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;

  ErrorCode code =
      indy_vdr_pool_refresh(poolHandle, callback, CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolGetStatus(jsi::Runtime &rt, jsi::Object options) {
  auto poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;
  ErrorCode code = indy_vdr_pool_get_status(poolHandle, callbackWithResponse,
                                            CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolGetTransactions(jsi::Runtime &rt, jsi::Object options) {
  auto poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;

  ErrorCode code = indy_vdr_pool_get_transactions(
      poolHandle, callbackWithResponse, CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolGetVerifiers(jsi::Runtime &rt, jsi::Object options) {
  auto poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;

  ErrorCode code = indy_vdr_pool_get_verifiers(poolHandle, callbackWithResponse,
                                               CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolSubmitAction(jsi::Runtime &rt, jsi::Object options) {
  auto poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");
  auto nodes = jsiToValue<std::string>(rt, options, "nodes", true);
  auto timeout = jsiToValue<int32_t>(rt, options, "timeout", true);

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;

  ErrorCode code = indy_vdr_pool_submit_action(
      poolHandle, requestHandle, nodes.length() > 0 ? nodes.c_str() : nullptr,
      timeout, callbackWithResponse, CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolSubmitRequest(jsi::Runtime &rt, jsi::Object options) {
  PoolHandle poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");

  jsi::Function cb = options.getPropertyAsFunction(rt, "cb");
  State *state = new State(&cb);
  state->rt = &rt;

  ErrorCode code = indy_vdr_pool_submit_request(
      poolHandle, requestHandle, callbackWithResponse, CallbackId(state));

  return createReturnValue(rt, code, nullptr);
};

jsi::Value poolClose(jsi::Runtime &rt, jsi::Object options) {
  PoolHandle poolHandle = jsiToValue<PoolHandle>(rt, options, "poolHandle");

  ErrorCode code = indy_vdr_pool_close(poolHandle);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value prepareTxnAuthorAgreementAcceptance(jsi::Runtime &rt,
                                               jsi::Object options) {
  auto text = jsiToValue<std::string>(rt, options, "text");
  auto version = jsiToValue<std::string>(rt, options, "version");
  auto taaDigest = jsiToValue<std::string>(rt, options, "taaDigest");
  auto acceptanceMechanismType =
      jsiToValue<std::string>(rt, options, "acceptanceMechanismType");
  auto time = jsiToValue<int32_t>(rt, options, "time");

  const char *out;

  ErrorCode code = indy_vdr_prepare_txn_author_agreement_acceptance(
      text.c_str(), version.c_str(), taaDigest.c_str(),
      acceptanceMechanismType.c_str(), time, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value requestFree(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");

  ErrorCode code = indy_vdr_request_free(requestHandle);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value requestGetBody(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");

  const char *out;

  ErrorCode code = indy_vdr_request_get_body(requestHandle, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value requestGetSignatureInput(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");

  const char *out;

  ErrorCode code = indy_vdr_request_get_signature_input(requestHandle, &out);

  return createReturnValue(rt, code, &out);
};

jsi::Value requestSetEndorser(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");
  auto endorser = jsiToValue<std::string>(rt, options, "endorser");

  ErrorCode code =
      indy_vdr_request_set_endorser(requestHandle, endorser.c_str());

  return createReturnValue(rt, code, nullptr);
};
jsi::Value requestSetMultiSignature(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");
  auto identifier = jsiToValue<std::string>(rt, options, "identifier");
  auto signature = jsiToValue<ByteBuffer>(rt, options, "signature");

  ErrorCode code = indy_vdr_request_set_multi_signature(
      requestHandle, identifier.c_str(), signature);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value requestSetSignature(jsi::Runtime &rt, jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");
  auto signature = jsiToValue<ByteBuffer>(rt, options, "signature");

  ErrorCode code = indy_vdr_request_set_signature(requestHandle, signature);

  return createReturnValue(rt, code, nullptr);
};

jsi::Value requestSetTxnAuthorAgreementAcceptance(jsi::Runtime &rt,
                                                  jsi::Object options) {
  auto requestHandle = jsiToValue<RequestHandle>(rt, options, "requestHandle");
  auto acceptance = jsiToValue<std::string>(rt, options, "acceptance");

  ErrorCode code = indy_vdr_request_set_txn_author_agreement_acceptance(
      requestHandle, acceptance.c_str());

  return createReturnValue(rt, code, nullptr);
};

} // namespace indyVdr
