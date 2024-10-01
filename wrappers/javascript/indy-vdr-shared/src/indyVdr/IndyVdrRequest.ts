import { indyVdr } from '../indyVdr/indyVdr'

export type RequestSetTxnAuthorAgreementAcceptanceOptions = {
  acceptance: { mechanism: string; taaDigest: string; time: number }
}

export type RequestSetMultiSignatureOptions = {
  identifier: string
  signature: Uint8Array
}

export type RequestSetSignatureOptions = {
  signature: Uint8Array
}

export type RequestSetEndorserOptions = {
  endorser: string
}

export type RequestResponseType<Request> = Request extends IndyVdrRequest<
  infer ResponseType
>
  ? ResponseType
  : never

export class IndyVdrRequest<
  ResponseType extends Record<string, unknown> = Record<string, unknown>,
> {
  private _handle: number

  // We need to use the generic that is passed to this class, otherwise TypeScript will lose the generic type passed to IndyVdrRequest
  // and we can't infer the response type. The value is protected, so it's won't be accessible from outside the class.
  protected __responseType__?: ResponseType

  public constructor(options: { handle: number }) {
    const { handle } = options

    this._handle = handle
  }

  public get handle(): number {
    return this._handle
  }

  public get body(): string {
    return indyVdr.requestGetBody({ requestHandle: this.handle })
  }

  public get signatureInput(): string {
    return indyVdr.requestGetSignatureInput({ requestHandle: this.handle })
  }

  public setEndorser(options: RequestSetEndorserOptions): void {
    indyVdr.requestSetEndorser({ requestHandle: this.handle, ...options })
  }

  public setMultiSignature(options: RequestSetMultiSignatureOptions): void {
    indyVdr.requestSetMultiSignature({
      requestHandle: this.handle,
      ...options,
    })
  }

  public setSignature(options: RequestSetSignatureOptions): void {
    indyVdr.requestSetSignature({ requestHandle: this.handle, ...options })
  }

  public setTransactionAuthorAgreementAcceptance(
    options: RequestSetTxnAuthorAgreementAcceptanceOptions,
  ): void {
    indyVdr.requestSetTxnAuthorAgreementAcceptance({
      requestHandle: this.handle,
      ...options,
    })
  }

  public free(): void {
    indyVdr.requestFree({ requestHandle: this.handle })
  }
}
