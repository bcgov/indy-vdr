import type {
  AcceptanceMechanismsRequestOptions,
  AttribRequestOptions,
  CredentialDefinitionRequestOptions,
  CustomRequestOptions,
  DisableAllTransactionAuthorAgreementsRequestOptions,
  GetAcceptanceMechanismsRequestOptions,
  GetAttribRequestOptions,
  GetCredentialDefinitionRequestOptions,
  GetNymRequestOptions,
  GetRevocationRegistryDefinitionRequestOptions,
  GetRevocationRegistryDeltaRequestOptions,
  GetRevocationRegistryRequestOptions,
  GetSchemaRequestOptions,
  GetTransactionAuthorAgreementRequestOptions,
  GetTransactionRequestOptions,
  GetValidatorInfoActionOptions,
  IndyVdr,
  IndyVdrErrorObject,
  NymRequestOptions,
  PoolCreateOptions,
  PoolStatus,
  PoolSubmitActionOptions,
  PoolSubmitRequestOptions,
  PrepareTxnAuthorAgreementAcceptanceOptions,
  RequestSetEndorserOptions,
  RequestSetMultiSignatureOptions,
  RequestSetSignatureOptions,
  RequestSetTxnAuthorAgreementAcceptanceOptions,
  RevocationRegistryDefinitionRequestOptions,
  RevocationRegistryEntryRequestOptions,
  SchemaRequestOptions,
  TransactionAuthorAgreementRequestOptions,
  Transactions,
  Verifiers,
} from '@hyperledger/indy-vdr-shared'
import type { NativeCallback, NativeCallbackWithResponse } from './ffi'

import {
  IndyVdrError,
  handleInvalidNullResponse,
} from '@hyperledger/indy-vdr-shared'

import {
  allocateHandle,
  allocateString,
  deallocateCallback,
  serializeArguments,
  toNativeCallback,
  toNativeCallbackWithResponse,
} from './ffi'
import { getNativeIndyVdr } from './library'

function handleReturnPointer<Return>(returnValue: Buffer): Return {
  if (returnValue.address() === 0) {
    throw IndyVdrError.customError({ message: 'Unexpected null pointer' })
  }

  return returnValue.deref() as Return
}

export class NodeJSIndyVdr implements IndyVdr {
  private promisify = async (
    method: (nativeCallbackPtr: Buffer, id: number) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cb: NativeCallback = (id, errorCode) => {
        deallocateCallback(id)

        try {
          this.handleError(errorCode)
        } catch (e) {
          reject(e)
        }

        resolve()
      }
      const { nativeCallback, id } = toNativeCallback(cb)
      method(nativeCallback, +id)
    })
  }

  private promisifyWithResponse = async <Return>(
    method: (nativeCallbackWithResponsePtr: Buffer, id: number) => void,
    isStream = false,
  ): Promise<Return | null> => {
    return new Promise((resolve, reject) => {
      const cb: NativeCallbackWithResponse = (id, errorCode, response) => {
        deallocateCallback(id)

        try {
          this.handleError(errorCode)
        } catch (e) {
          return reject(e)
        }

        try {
          //this is required to add array brackets, and commas, to an invalid json object that
          // should be a list
          const mappedResponse = isStream
            ? `[${response.replace(/\n/g, ',')}]`
            : response

          if (mappedResponse.length === 0) return resolve(null)
          resolve(JSON.parse(mappedResponse) as Return)
        } catch (error) {
          reject(error)
        }
      }
      const { nativeCallback, id } = toNativeCallbackWithResponse(cb)
      method(nativeCallback, +id)
    })
  }

  private handleError(code: number) {
    if (code === 0) return

    const nativeError = allocateString()
    this.nativeIndyVdr.indy_vdr_get_current_error(nativeError)

    const indyVdrErrorObject = JSON.parse(
      nativeError.deref() as string,
    ) as IndyVdrErrorObject

    throw new IndyVdrError(indyVdrErrorObject)
  }

  public get nativeIndyVdr() {
    return getNativeIndyVdr()
  }

  public getCurrentError(): string {
    const error = allocateString()
    this.handleError(this.nativeIndyVdr.indy_vdr_get_current_error(error))

    return handleReturnPointer<string>(error)
  }

  public version(): string {
    return this.nativeIndyVdr.indy_vdr_version()
  }

  public setConfig(options: { config: Record<string, unknown> }): void {
    const { config } = serializeArguments(options)
    this.handleError(this.nativeIndyVdr.indy_vdr_set_config(config))
  }

  public setCacheDirectory(options: { path: string }): void {
    const { path } = serializeArguments(options)
    this.handleError(this.nativeIndyVdr.indy_vdr_set_cache_directory(path))
  }

  public setLedgerTxnCache(options: {
    capacity: number
    expiry_offset_ms: number
    path?: string
  }): void {
    const { capacity, expiry_offset_ms, path } = serializeArguments(options)
    this.handleError(
      this.nativeIndyVdr.indy_vdr_set_ledger_txn_cache(
        capacity,
        expiry_offset_ms,
        path,
      ),
    )
  }

  public setDefaultLogger(): void {
    this.handleError(this.nativeIndyVdr.indy_vdr_set_default_logger())
  }

  public setProtocolVersion(options: { version: number }): void {
    const { version } = serializeArguments(options)
    this.handleError(this.nativeIndyVdr.indy_vdr_set_protocol_version(version))
  }

  public setSocksProxy(options: { socksProxy: string }): void {
    const { socksProxy } = serializeArguments(options)
    this.handleError(this.nativeIndyVdr.indy_vdr_set_socks_proxy(socksProxy))
  }

  public buildAcceptanceMechanismsRequest(
    options: AcceptanceMechanismsRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { version, aml, submitterDid, amlContext } =
      serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_acceptance_mechanisms_request(
        submitterDid,
        aml,
        version,
        amlContext,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetAcceptanceMechanismsRequest(
    options: GetAcceptanceMechanismsRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { submitterDid, timestamp, version } = serializeArguments(options)

    // We cannot handle this step in the serialization. Indy-vdr expects a -1 for an undefined timestamp
    const convertedTimestamp = timestamp ?? -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_acceptance_mechanisms_request(
        submitterDid,
        convertedTimestamp,
        version,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildAttribRequest(options: AttribRequestOptions): number {
    const requestHandle = allocateHandle()
    const { submitterDid, targetDid, raw, hash, enc } =
      serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_attrib_request(
        submitterDid,
        targetDid,
        hash,
        raw,
        enc,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetAttribRequest(options: GetAttribRequestOptions): number {
    const requestHandle = allocateHandle()
    const { submitterDid, targetDid, raw, hash, enc, seqNo, timestamp } =
      serializeArguments(options)
    const convertedTimestamp = timestamp ?? -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_attrib_request(
        submitterDid,
        targetDid,
        raw,
        hash,
        enc,
        seqNo,
        convertedTimestamp,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildCredDefRequest(
    options: CredentialDefinitionRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { credentialDefinition, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_cred_def_request(
        submitterDid,
        credentialDefinition,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetCredDefRequest(
    options: GetCredentialDefinitionRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { credentialDefinitionId, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_cred_def_request(
        submitterDid,
        credentialDefinitionId,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetRevocRegDefRequest(
    options: GetRevocationRegistryDefinitionRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { revocationRegistryId, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_revoc_reg_def_request(
        submitterDid,
        revocationRegistryId,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetRevocRegRequest(
    options: GetRevocationRegistryRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { revocationRegistryId, timestamp, submitterDid } =
      serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_revoc_reg_request(
        submitterDid,
        revocationRegistryId,
        timestamp,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetRevocRegDeltaRequest(
    options: GetRevocationRegistryDeltaRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { revocationRegistryId, toTs, fromTs, submitterDid } =
      serializeArguments(options)

    const convertedFromTs = fromTs ?? -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_revoc_reg_delta_request(
        submitterDid,
        revocationRegistryId,
        convertedFromTs,
        toTs,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildRevocRegDefRequest(
    options: RevocationRegistryDefinitionRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const {
      submitterDid,
      revocationRegistryDefinitionV1: revocationRegistryDefinition,
    } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_revoc_reg_def_request(
        submitterDid,
        revocationRegistryDefinition,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildCustomRequest(options: CustomRequestOptions): number {
    const requestHandle = allocateHandle()
    const { customRequest } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_custom_request(
        customRequest,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildDisableAllTxnAuthorAgreementsRequest(
    options: DisableAllTransactionAuthorAgreementsRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_disable_all_txn_author_agreements_request(
        submitterDid,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetNymRequest(options: GetNymRequestOptions): number {
    const requestHandle = allocateHandle()
    const { dest, submitterDid, seqNo, timestamp } = serializeArguments(options)
    const convertedSeqNo = seqNo ?? -1
    const convertedTimestamp = timestamp ?? -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_nym_request(
        submitterDid,
        dest,
        convertedSeqNo,
        convertedTimestamp,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetSchemaRequest(options: GetSchemaRequestOptions): number {
    const requestHandle = allocateHandle()
    const { schemaId, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_schema_request(
        submitterDid,
        schemaId,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetTxnAuthorAgreementRequest(
    options: GetTransactionAuthorAgreementRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { data, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_txn_author_agreement_request(
        submitterDid,
        data,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetTxnRequest(options: GetTransactionRequestOptions): number {
    const requestHandle = allocateHandle()
    const { ledgerType, seqNo, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_txn_request(
        submitterDid,
        ledgerType,
        seqNo,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildGetValidatorInfoRequest(
    options: GetValidatorInfoActionOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_get_validator_info_request(
        submitterDid,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildNymRequest(options: NymRequestOptions): number {
    const requestHandle = allocateHandle()
    const { dest, submitterDid, alias, role, verkey, diddocContent } =
      serializeArguments(options)
    const version = options.version || -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_nym_request(
        submitterDid,
        dest,
        verkey,
        alias,
        role,
        diddocContent,
        version,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildRevocRegEntryRequest(
    options: RevocationRegistryEntryRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const {
      revocationRegistryDefinitionId,
      revocationRegistryDefinitionType,
      revocationRegistryEntry,
      submitterDid,
    } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_revoc_reg_entry_request(
        submitterDid,
        revocationRegistryDefinitionId,
        revocationRegistryDefinitionType,
        revocationRegistryEntry,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildSchemaRequest(options: SchemaRequestOptions): number {
    const requestHandle = allocateHandle()
    const { schema, submitterDid } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_schema_request(
        submitterDid,
        schema,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public buildTxnAuthorAgreementRequest(
    options: TransactionAuthorAgreementRequestOptions,
  ): number {
    const requestHandle = allocateHandle()
    const { submitterDid, version, ratificationTs, retirementTs, text } =
      serializeArguments(options)

    const convertedRatificationTs = ratificationTs ?? -1
    const convertedRetirementTs = retirementTs ?? -1

    this.handleError(
      this.nativeIndyVdr.indy_vdr_build_txn_author_agreement_request(
        submitterDid,
        text,
        version,
        convertedRatificationTs,
        convertedRetirementTs,
        requestHandle,
      ),
    )

    return handleReturnPointer<number>(requestHandle)
  }

  public poolCreate(options: PoolCreateOptions): number {
    const poolHandle = allocateHandle()
    const { parameters } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_pool_create(parameters, poolHandle),
    )

    return handleReturnPointer<number>(poolHandle)
  }

  public async poolRefresh(options: { poolHandle: number }): Promise<void> {
    const { poolHandle } = serializeArguments(options)

    return this.promisify((cbPtr, id) =>
      this.nativeIndyVdr.indy_vdr_pool_refresh(poolHandle, cbPtr, id),
    )
  }

  public async poolGetStatus(options: {
    poolHandle: number
  }): Promise<PoolStatus> {
    const { poolHandle } = serializeArguments(options)

    const poolStatus = await this.promisifyWithResponse<PoolStatus>(
      (cbPtr, id) =>
        this.nativeIndyVdr.indy_vdr_pool_get_status(poolHandle, cbPtr, id),
    )

    return handleInvalidNullResponse(poolStatus)
  }

  public async poolGetTransactions(options: {
    poolHandle: number
  }): Promise<Transactions> {
    const { poolHandle } = serializeArguments(options)

    const transactions = await this.promisifyWithResponse<Transactions>(
      (cbPtr, id) =>
        this.nativeIndyVdr.indy_vdr_pool_get_transactions(
          poolHandle,
          cbPtr,
          id,
        ),
      true,
    )

    return handleInvalidNullResponse(transactions)
  }

  public async poolGetVerifiers(options: {
    poolHandle: number
  }): Promise<Verifiers> {
    const { poolHandle } = serializeArguments(options)

    const verifiers = await this.promisifyWithResponse<Verifiers>((cbPtr, id) =>
      this.nativeIndyVdr.indy_vdr_pool_get_verifiers(poolHandle, cbPtr, id),
    )

    return handleInvalidNullResponse(verifiers)
  }

  public async poolSubmitAction<T>(
    options: PoolSubmitActionOptions & { poolHandle: number },
  ): Promise<T> {
    const { requestHandle, poolHandle, nodes, timeout } =
      serializeArguments(options)

    const response = await this.promisifyWithResponse<T>((cbPtr, id) =>
      this.nativeIndyVdr.indy_vdr_pool_submit_action(
        poolHandle,
        requestHandle,
        nodes,
        timeout,
        cbPtr,
        id,
      ),
    )

    return handleInvalidNullResponse(response)
  }

  public async poolSubmitRequest<T>(
    options: PoolSubmitRequestOptions & { poolHandle: number },
  ): Promise<T> {
    const { requestHandle, poolHandle } = serializeArguments(options)

    const response = await this.promisifyWithResponse<T>((cbPtr, id) =>
      this.nativeIndyVdr.indy_vdr_pool_submit_request(
        poolHandle,
        requestHandle,
        cbPtr,
        id,
      ),
    )

    return handleInvalidNullResponse(response)
  }

  public poolClose(options: { poolHandle: number }): void {
    const { poolHandle } = serializeArguments(options)

    this.handleError(this.nativeIndyVdr.indy_vdr_pool_close(poolHandle))
  }

  public prepareTxnAuthorAgreementAcceptance(
    options: PrepareTxnAuthorAgreementAcceptanceOptions,
  ): string {
    const output = allocateString()
    const { acceptanceMechanismType, time, taaDigest, text, version } =
      serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_prepare_txn_author_agreement_acceptance(
        text,
        version,
        taaDigest,
        acceptanceMechanismType,
        time,
        output,
      ),
    )

    return handleReturnPointer<string>(output)
  }

  public requestFree(options: { requestHandle: number }): void {
    const { requestHandle } = serializeArguments(options)

    this.handleError(this.nativeIndyVdr.indy_vdr_request_free(requestHandle))
  }

  public requestGetBody(options: { requestHandle: number }): string {
    const output = allocateString()
    const { requestHandle } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_get_body(requestHandle, output),
    )

    return handleReturnPointer<string>(output)
  }

  public requestGetSignatureInput(options: { requestHandle: number }): string {
    const output = allocateString()
    const { requestHandle } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_get_signature_input(
        requestHandle,
        output,
      ),
    )

    return handleReturnPointer<string>(output)
  }

  public requestSetEndorser(
    options: RequestSetEndorserOptions & { requestHandle: number },
  ): void {
    const { endorser, requestHandle } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_set_endorser(requestHandle, endorser),
    )
  }

  public requestSetMultiSignature(
    options: RequestSetMultiSignatureOptions & { requestHandle: number },
  ): void {
    const { identifier, requestHandle, signature } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_set_multi_signature(
        requestHandle,
        identifier,
        signature,
      ),
    )
  }

  public requestSetSignature(
    options: RequestSetSignatureOptions & { requestHandle: number },
  ): void {
    const { requestHandle, signature } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_set_signature(
        requestHandle,
        signature,
      ),
    )
  }

  public requestSetTxnAuthorAgreementAcceptance(
    options: RequestSetTxnAuthorAgreementAcceptanceOptions & {
      requestHandle: number
    },
  ): void {
    const { acceptance, requestHandle } = serializeArguments(options)

    this.handleError(
      this.nativeIndyVdr.indy_vdr_request_set_txn_author_agreement_acceptance(
        requestHandle,
        acceptance,
      ),
    )
  }
}
