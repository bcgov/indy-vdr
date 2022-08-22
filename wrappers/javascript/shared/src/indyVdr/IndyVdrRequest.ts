import { indyVdr } from '../indyVdr/indyVdr'

export type RequestSetTxnAuthorAgreementAcceptanceOptions = {
  acceptance: {
    mechanism: string
    taaDigest: string
    // TODO: should we use date?
    time: number
  }
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

export class IndyVdrRequest {
  private _handle: number

  public constructor(options: { handle: number }) {
    const { handle } = options

    this._handle = handle
  }

  public get handle(): number {
    return this._handle
  }

  public get body(): Record<string, unknown> {
    return indyVdr.requestGetBody({ requestHandle: this.handle })
  }

  public get signatureInput(): string {
    return indyVdr.requestGetSignatureInput({ requestHandle: this.handle })
  }

  public setEndorser(options: RequestSetEndorserOptions): void {
    indyVdr.requestSetEndorser({ requestHandle: this.handle, ...options })
  }

  public setMultiSignature(options: RequestSetMultiSignatureOptions): void {
    indyVdr.requestSetMultiSignature({ requestHandle: this.handle, ...options })
  }

  public setSignature(options: RequestSetSignatureOptions): void {
    indyVdr.requestSetSignature({ requestHandle: this.handle, ...options })
  }

  public setTransactionAuthorAgreementAcceptance(options: RequestSetTxnAuthorAgreementAcceptanceOptions): void {
    indyVdr.requestSetTxnAuthorAgreementAcceptance({ requestHandle: this.handle, ...options })
  }

  public free(): void {
    indyVdr.requestFree({ requestHandle: this.handle })
  }
}
