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
  NymRequestOptions,
  PoolCreateOptions,
  RevocationRegistryDefinitionRequestOptions,
  RevocationRegistryEntryRequestOptions,
  SchemaRequestOptions,
  TransactionAuthorAgreementRequestOptions,
} from '../builder'
import type {
  RequestSetEndorserOptions,
  RequestSetMultiSignatureOptions,
  RequestSetSignatureOptions,
  RequestSetTxnAuthorAgreementAcceptanceOptions,
} from '../indyVdr'
import type { PrepareTxnAuthorAgreementAcceptanceOptions } from './builderTypes'
import type {
  PoolHandle,
  PoolStatus,
  PoolSubmitActionOptions,
  PoolSubmitRequestOptions,
  RequestHandle,
  Transactions,
  Verifiers,
} from './types'

// TODO: proper documentation
export interface IndyVdr {
  getCurrentError(): string

  version(): string

  setConfig(options: { config: Record<string, unknown> }): void

  setCacheDirectory(options: { path: string }): void

  setLedgerTxnCache(options: {
    capacity: number
    expiry_offset_ms: number
    path?: string
  }): void

  setDefaultLogger(): void

  setProtocolVersion(options: { version: number }): void

  setSocksProxy(options: { socksProxy: string }): void

  buildAcceptanceMechanismsRequest(
    options: AcceptanceMechanismsRequestOptions,
  ): number

  buildGetAcceptanceMechanismsRequest(
    options: GetAcceptanceMechanismsRequestOptions,
  ): number

  buildAttribRequest(options: AttribRequestOptions): number

  buildGetAttribRequest(options: GetAttribRequestOptions): number

  buildCredDefRequest(options: CredentialDefinitionRequestOptions): number

  buildGetCredDefRequest(options: GetCredentialDefinitionRequestOptions): number

  buildGetRevocRegDefRequest(
    options: GetRevocationRegistryDefinitionRequestOptions,
  ): number

  buildGetRevocRegRequest(options: GetRevocationRegistryRequestOptions): number

  buildGetRevocRegDeltaRequest(
    options: GetRevocationRegistryDeltaRequestOptions,
  ): number

  buildRevocRegDefRequest(
    options: RevocationRegistryDefinitionRequestOptions,
  ): number

  buildCustomRequest(options: CustomRequestOptions): number

  buildDisableAllTxnAuthorAgreementsRequest(
    options: DisableAllTransactionAuthorAgreementsRequestOptions,
  ): number

  buildGetNymRequest(options: GetNymRequestOptions): number

  buildGetSchemaRequest(options: GetSchemaRequestOptions): number

  buildGetTxnAuthorAgreementRequest(
    options: GetTransactionAuthorAgreementRequestOptions,
  ): number

  buildGetTxnRequest(options: GetTransactionRequestOptions): number

  buildGetValidatorInfoRequest(options: GetValidatorInfoActionOptions): number

  buildNymRequest(options: NymRequestOptions): number

  buildRevocRegEntryRequest(
    options: RevocationRegistryEntryRequestOptions,
  ): number

  buildSchemaRequest(options: SchemaRequestOptions): number

  buildTxnAuthorAgreementRequest(
    options: TransactionAuthorAgreementRequestOptions,
  ): number

  poolCreate(options: PoolCreateOptions): number

  poolRefresh(options: { poolHandle: PoolHandle }): Promise<void>

  poolGetStatus(options: { poolHandle: PoolHandle }): Promise<PoolStatus>

  poolGetTransactions(options: {
    poolHandle: PoolHandle
  }): Promise<Transactions>

  poolGetVerifiers(options: { poolHandle: PoolHandle }): Promise<Verifiers>

  poolSubmitAction<T extends Record<string, unknown>>(
    options: PoolSubmitActionOptions,
  ): Promise<T>

  poolSubmitRequest<T extends Record<string, unknown>>(
    options: PoolSubmitRequestOptions,
  ): Promise<T>

  poolClose(options: { poolHandle: number }): void

  prepareTxnAuthorAgreementAcceptance(
    options: PrepareTxnAuthorAgreementAcceptanceOptions,
  ): string

  requestFree(options: { requestHandle: number }): void

  requestGetBody(options: { requestHandle: number }): string

  requestGetSignatureInput(options: { requestHandle: number }): string

  requestSetEndorser(
    options: RequestSetEndorserOptions & { requestHandle: RequestHandle },
  ): void

  requestSetMultiSignature(
    options: RequestSetMultiSignatureOptions & { requestHandle: RequestHandle },
  ): void

  requestSetSignature(
    options: RequestSetSignatureOptions & { requestHandle: RequestHandle },
  ): void

  requestSetTxnAuthorAgreementAcceptance(
    options: RequestSetTxnAuthorAgreementAcceptanceOptions & {
      requestHandle: RequestHandle
    },
  ): void
}
