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
  PoolHandle,
  PoolStatus,
  PoolSubmitActionOptions,
  PoolSubmitRequestOptions,
  PrepareTxnAuthorAgreementAcceptanceOptions,
  RequestHandle,
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
import type { NativeBindings } from './NativeBindings'
import type { Callback, CallbackWithResponse, ReturnObject } from './serialize'

import {
  IndyVdrError,
  handleInvalidNullResponse,
} from '@hyperledger/indy-vdr-shared'

import { serializeArguments } from './serialize'

export class ReactNativeIndyVdr implements IndyVdr {
  private indyVdr: NativeBindings

  public constructor(bindings: NativeBindings) {
    this.indyVdr = bindings
  }

  private handleError<T>({ errorCode, value }: ReturnObject<T>): T {
    if (errorCode !== 0) {
      throw new IndyVdrError(
        JSON.parse(this.getCurrentError()) as IndyVdrErrorObject,
      )
    }

    return value as T
  }

  private promisify = (method: (cb: Callback) => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      const _cb: Callback = ({ errorCode }) => {
        if (errorCode !== 0) reject(this.getCurrentError())
        resolve()
      }

      method(_cb)
    })
  }

  private promisifyWithResponse = <Return>(
    method: (cb: CallbackWithResponse<Return>) => void,
    isStream = false,
  ): Promise<Return | null> => {
    return new Promise((resolve, reject) => {
      const cb: CallbackWithResponse = ({ value, errorCode }) => {
        if (errorCode !== 0)
          reject(
            new IndyVdrError(
              JSON.parse(this.getCurrentError()) as IndyVdrErrorObject,
            ),
          )

        // this is required to add array brackets, and commas, to an invalid json object that
        //should be a list
        if (typeof value === 'string' && isStream) {
          const mappedResponse = isStream
            ? `[${value.replace(/\n/g, ',')}]`
            : value

          if (mappedResponse.length === 0) return resolve(null)
          resolve(JSON.parse(mappedResponse) as Return)
        } else {
          resolve(value as Return)
        }
      }

      method(cb)
    })
  }

  public getCurrentError(): string {
    return this.indyVdr.getCurrentError({})
  }

  public version(): string {
    return this.indyVdr.version({})
  }

  public setConfig(options: { config: Record<string, unknown> }): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.setConfig(serializedOptions)
  }

  public setCacheDirectory(options: { path: string }): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.setCacheDirectory(serializedOptions)
  }
  public setLedgerTxnCache(options: {
    capacity: number
    expiry_offset_ms: number
    path?: string
  }): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.setLedgerTxnCache(serializedOptions)
  }

  public setDefaultLogger(): void {
    this.handleError(this.indyVdr.setDefaultLogger({}))
  }

  public setProtocolVersion(options: { version: number }): void {
    const serializedOptions = serializeArguments(options)
    this.handleError(this.indyVdr.setProtocolVersion(serializedOptions))
  }

  public setSocksProxy(options: { socksProxy: string }): void {
    const serializedOptions = serializeArguments(options)
    this.handleError(this.indyVdr.setSocksProxy(serializedOptions))
  }

  public buildAcceptanceMechanismsRequest(
    options: AcceptanceMechanismsRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildAcceptanceMechanismsRequest(serializedOptions),
      ),
    )
  }

  public buildGetAcceptanceMechanismsRequest(
    options: GetAcceptanceMechanismsRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildGetAcceptanceMechanismsRequest(serializedOptions),
      ),
    )
  }

  public buildAttribRequest(options: AttribRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildAttribRequest(serializedOptions)),
    )
  }

  public buildGetAttribRequest(options: GetAttribRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetAttribRequest(serializedOptions)),
    )
  }

  public buildCredDefRequest(
    options: CredentialDefinitionRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildCredDefRequest(serializedOptions)),
    )
  }

  public buildGetCredDefRequest(
    options: GetCredentialDefinitionRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetCredDefRequest(serializedOptions)),
    )
  }

  public buildGetRevocRegDefRequest(
    options: GetRevocationRegistryDefinitionRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildGetRevocRegDefRequest(serializedOptions),
      ),
    )
  }

  public buildGetRevocRegRequest(
    options: GetRevocationRegistryRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetRevocRegRequest(serializedOptions)),
    )
  }

  public buildGetRevocRegDeltaRequest(
    options: GetRevocationRegistryDeltaRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildGetRevocRegDeltaRequest(serializedOptions),
      ),
    )
  }

  public buildRevocRegDefRequest(
    options: RevocationRegistryDefinitionRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildRevocRegDefRequest(serializedOptions)),
    )
  }

  public buildCustomRequest(options: CustomRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildCustomRequest(serializedOptions)),
    )
  }

  public buildDisableAllTxnAuthorAgreementsRequest(
    options: DisableAllTransactionAuthorAgreementsRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildDisableAllTxnAuthorAgreementsRequest(
          serializedOptions,
        ),
      ),
    )
  }

  public buildGetNymRequest(options: GetNymRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetNymRequest(serializedOptions)),
    )
  }

  public buildGetSchemaRequest(options: GetSchemaRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetSchemaRequest(serializedOptions)),
    )
  }

  public buildGetTxnAuthorAgreementRequest(
    options: GetTransactionAuthorAgreementRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildGetTxnAuthorAgreementRequest(serializedOptions),
      ),
    )
  }

  public buildGetTxnRequest(options: GetTransactionRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildGetTxnRequest(serializedOptions)),
    )
  }

  public buildGetValidatorInfoRequest(
    options: GetValidatorInfoActionOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildGetValidatorInfoRequest(serializedOptions),
      ),
    )
  }

  public buildNymRequest(options: NymRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildNymRequest(serializedOptions)),
    )
  }

  public buildRevocRegEntryRequest(
    options: RevocationRegistryEntryRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildRevocRegEntryRequest(serializedOptions),
      ),
    )
  }

  public buildSchemaRequest(options: SchemaRequestOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.buildSchemaRequest(serializedOptions)),
    )
  }

  public buildTxnAuthorAgreementRequest(
    options: TransactionAuthorAgreementRequestOptions,
  ): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.buildTxnAuthorAgreementRequest(serializedOptions),
      ),
    )
  }

  public poolCreate(options: PoolCreateOptions): number {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(this.indyVdr.poolCreate(serializedOptions)),
    )
  }

  public async poolRefresh(options: { poolHandle: PoolHandle }): Promise<void> {
    const { poolHandle } = serializeArguments(options)
    return this.promisify((cb) =>
      this.handleError(this.indyVdr.poolRefresh({ cb, poolHandle })),
    )
  }

  public async poolGetStatus(options: {
    poolHandle: PoolHandle
  }): Promise<PoolStatus> {
    const { poolHandle } = serializeArguments(options)
    const result = handleInvalidNullResponse(
      await this.promisifyWithResponse<string>((cb) =>
        this.handleError(this.indyVdr.poolGetStatus({ cb, poolHandle })),
      ),
    )

    return JSON.parse(result) as PoolStatus
  }

  public async poolGetTransactions(options: {
    poolHandle: PoolHandle
  }): Promise<Transactions> {
    const { poolHandle } = serializeArguments(options)
    const result = handleInvalidNullResponse(
      await this.promisifyWithResponse<Transactions>(
        (cb) => this.indyVdr.poolGetTransactions({ cb, poolHandle }),
        true,
      ),
    )

    return result
  }

  public async poolGetVerifiers(options: {
    poolHandle: PoolHandle
  }): Promise<Verifiers> {
    const { poolHandle } = serializeArguments(options)
    const result = handleInvalidNullResponse(
      await this.promisifyWithResponse<string>((cb) =>
        this.indyVdr.poolGetVerifiers({ cb, poolHandle }),
      ),
    )

    return JSON.parse(result) as Verifiers
  }

  public async poolSubmitAction<T extends Record<string, unknown>>(
    options: PoolSubmitActionOptions & { poolHandle: PoolHandle },
  ): Promise<T> {
    const serializedOptions = serializeArguments(options)
    const result = handleInvalidNullResponse(
      await this.promisifyWithResponse<string>((cb) =>
        this.indyVdr.poolSubmitAction({ cb, ...serializedOptions }),
      ),
    )

    return JSON.parse(result) as T
  }

  public async poolSubmitRequest<T extends Record<string, unknown>>(
    options: PoolSubmitRequestOptions & { poolHandle: PoolHandle },
  ): Promise<T> {
    const serializedOptions = serializeArguments(options)
    const result = handleInvalidNullResponse(
      await this.promisifyWithResponse<string>((cb) =>
        this.indyVdr.poolSubmitRequest({ cb, ...serializedOptions }),
      ),
    )

    return JSON.parse(result) as T
  }

  public poolClose(options: { poolHandle: number }): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.poolClose(serializedOptions)
  }

  public prepareTxnAuthorAgreementAcceptance(
    options: PrepareTxnAuthorAgreementAcceptanceOptions,
  ): string {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.prepareTxnAuthorAgreementAcceptance(serializedOptions),
      ),
    )
  }

  public requestFree(options: { requestHandle: number }): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.requestFree(serializedOptions)
  }

  public requestGetBody(options: { requestHandle: number }): string {
    const serializedOptions = serializeArguments(options)
    return this.handleError(this.indyVdr.requestGetBody(serializedOptions))
  }

  public requestGetSignatureInput(options: { requestHandle: number }): string {
    const serializedOptions = serializeArguments(options)
    return handleInvalidNullResponse(
      this.handleError(
        this.indyVdr.requestGetSignatureInput(serializedOptions),
      ),
    )
  }

  public requestSetEndorser(
    options: RequestSetEndorserOptions & { requestHandle: RequestHandle },
  ): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.requestSetEndorser(serializedOptions)
  }

  public requestSetMultiSignature(
    options: RequestSetMultiSignatureOptions & { requestHandle: RequestHandle },
  ): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.requestSetMultiSignature(serializedOptions)
  }

  public requestSetSignature(
    options: RequestSetSignatureOptions & { requestHandle: RequestHandle },
  ): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.requestSetSignature(serializedOptions)
  }

  public requestSetTxnAuthorAgreementAcceptance(
    options: RequestSetTxnAuthorAgreementAcceptanceOptions & {
      requestHandle: RequestHandle
    },
  ): void {
    const serializedOptions = serializeArguments(options)
    this.indyVdr.requestSetTxnAuthorAgreementAcceptance(serializedOptions)
  }
}
