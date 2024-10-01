import type { Transactions } from '@hyperledger/indy-vdr-shared'
import type { Callback, CallbackWithResponse, ReturnObject } from './serialize'

export type PoolHandle = number
export type RequestHandle = number

export interface NativeBindings {
  version(options: Record<string, never>): string

  getCurrentError(options: Record<string, never>): string

  setConfig(options: { config: string }): ReturnObject<never>

  setCacheDirectory(options: { path: string }): ReturnObject<never>

  setLedgerTxnCache(options: {
    capacity: number
    expiry_offset_ms: number
    path?: string
  }): ReturnObject<never>

  setDefaultLogger(options: Record<string, never>): ReturnObject<never>

  setProtocolVersion(options: { version: number }): ReturnObject<never>

  setSocksProxy(options: { socksProxy: string }): ReturnObject<never>

  buildAcceptanceMechanismsRequest(options: {
    submitterDid: string
    aml: string
    version: string
    amlContext?: string
  }): ReturnObject<RequestHandle>

  buildGetAcceptanceMechanismsRequest(options: {
    submitterDid?: string
    timestamp?: number
    version?: string
  }): ReturnObject<RequestHandle>

  buildAttribRequest(options: {
    submitterDid: string
    targetDid: string
    hash?: string
    raw?: string
    enc?: string
  }): ReturnObject<RequestHandle>

  buildGetAttribRequest(options: {
    submitterDid?: string
    targetDid: string
    raw?: string
    hash?: string
    enc?: string
    seqNo?: number
    timestamp?: number
  }): ReturnObject<RequestHandle>

  buildCredDefRequest(options: {
    submitterDid: string
    credentialDefinition: string
  }): ReturnObject<RequestHandle>

  buildGetCredDefRequest(options: {
    submitterDid?: string
    credentialDefinitionId: string
  }): ReturnObject<RequestHandle>

  buildGetRevocRegDefRequest(options: {
    submitterDid?: string
    revocationRegistryId: string
  }): ReturnObject<RequestHandle>

  buildGetRevocRegRequest(options: {
    submitterDid?: string
    revocationRegistryId: string
    timestamp: number
  }): ReturnObject<RequestHandle>

  buildGetRevocRegDeltaRequest(options: {
    submitterDid?: string
    revocationRegistryId: string
    fromTs?: number
    toTs: number
  }): ReturnObject<RequestHandle>

  buildRevocRegDefRequest(options: {
    submitterDid: string
    revocationRegistryDefinitionV1: string
  }): ReturnObject<RequestHandle>

  buildCustomRequest(options: {
    customRequest: string
  }): ReturnObject<RequestHandle>

  buildDisableAllTxnAuthorAgreementsRequest(options: {
    submitterDid: string
  }): ReturnObject<RequestHandle>

  buildGetNymRequest(options: {
    submitterDid?: string
    dest: string
    didDocContent?: string
    version?: number
    seqNo?: number
  }): ReturnObject<RequestHandle>

  buildGetSchemaRequest(options: {
    submitterDid?: string
    schemaId: string
  }): ReturnObject<RequestHandle>

  buildGetTxnAuthorAgreementRequest(options: {
    submitterDid?: string
    data?: string
  }): ReturnObject<RequestHandle>

  buildGetTxnRequest(options: {
    submitterDid?: string
    ledgerType: number
    seqNo: number
  }): ReturnObject<RequestHandle>

  buildGetValidatorInfoRequest(options: {
    submitterDid: string
  }): ReturnObject<RequestHandle>

  buildNymRequest(options: {
    submitterDid: string
    dest: string
    verkey?: string
    alias?: string
    role?: string
  }): ReturnObject<RequestHandle>

  buildRevocRegEntryRequest(options: {
    submitterDid: string
    revocationRegistryDefinitionId: string
    revocationRegistryDefinitionType: string
    revocationRegistryEntry: string
  }): ReturnObject<RequestHandle>

  buildSchemaRequest(options: {
    submitterDid: string
    schema: string
  }): ReturnObject<RequestHandle>

  buildTxnAuthorAgreementRequest(options: {
    submitterDid: string
    text?: string
    version: string
    ratificationTs?: number
    retirementTs?: number
  }): ReturnObject<RequestHandle>

  poolCreate(options: { parameters: string }): ReturnObject<PoolHandle>

  poolRefresh(options: {
    poolHandle: PoolHandle
    cb: Callback
  }): ReturnObject<never>

  poolGetStatus(options: {
    poolHandle: PoolHandle
    cb: CallbackWithResponse<string>
  }): ReturnObject<never>

  poolGetTransactions(options: {
    poolHandle: PoolHandle
    cb: CallbackWithResponse<Transactions>
  }): ReturnObject<never>

  poolGetVerifiers(options: {
    poolHandle: PoolHandle
    cb: CallbackWithResponse<string>
  }): ReturnObject<never>

  poolSubmitAction(options: {
    poolHandle: PoolHandle
    requestHandle: number
    nodes?: string
    timeout?: number
    cb: CallbackWithResponse<string>
  }): ReturnObject<never>

  poolSubmitRequest(options: {
    poolHandle: PoolHandle
    requestHandle: number
    cb: CallbackWithResponse<string>
  }): ReturnObject<never>

  poolClose(options: { poolHandle: PoolHandle }): ReturnObject<never>

  prepareTxnAuthorAgreementAcceptance(options: {
    text?: string
    version?: string
    taaDigest?: string
    acceptanceMechanismType: string
    time: number
  }): ReturnObject<string>

  requestFree(options: { requestHandle: number }): ReturnObject<never>

  requestGetBody(options: { requestHandle: number }): ReturnObject<string>

  requestGetSignatureInput(options: {
    requestHandle: number
  }): ReturnObject<string>

  requestSetEndorser(options: {
    requestHandle: number
    endorser: string
  }): ReturnObject<never>

  requestSetMultiSignature(options: {
    requestHandle: number
    identifier: string
    signature: ArrayBuffer
  }): ReturnObject<never>

  requestSetSignature(options: {
    requestHandle: number
    signature: ArrayBuffer
  }): ReturnObject<never>

  requestSetTxnAuthorAgreementAcceptance(options: {
    requestHandle: number
    acceptance: string
  }): ReturnObject<never>
}
