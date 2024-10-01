import type { PoolStatus, Transactions, Verifiers } from '../types'
import type { IndyVdrRequest, RequestResponseType } from './IndyVdrRequest'

import { indyVdr } from './indyVdr'

interface SubmitActionOptions {
  nodes?: string[]
  timeout?: number
}

export class IndyVdrPool {
  private _handle: number

  public constructor(options: { handle: number }) {
    const { handle } = options

    this._handle = handle
  }

  public get handle(): number {
    return this._handle
  }

  public get status(): Promise<PoolStatus> {
    return indyVdr.poolGetStatus({ poolHandle: this.handle })
  }

  public get verifiers(): Promise<Verifiers> {
    return indyVdr.poolGetVerifiers({ poolHandle: this.handle })
  }

  public get transactions(): Promise<Transactions> {
    return indyVdr.poolGetTransactions({ poolHandle: this.handle })
  }

  public async refresh(): Promise<void> {
    await indyVdr.poolRefresh({ poolHandle: this.handle })
  }

  public close(): void {
    indyVdr.poolClose({ poolHandle: this.handle })
  }

  public async submitAction<Request extends IndyVdrRequest>(
    request: Request,
    options: SubmitActionOptions = {},
  ): Promise<RequestResponseType<Request>> {
    return indyVdr.poolSubmitAction({
      poolHandle: this.handle,
      requestHandle: request.handle,
      ...options,
    })
  }

  public async submitRequest<Request extends IndyVdrRequest>(
    request: Request,
  ): Promise<RequestResponseType<Request>> {
    return indyVdr.poolSubmitRequest({
      poolHandle: this.handle,
      requestHandle: request.handle,
    })
  }
}
