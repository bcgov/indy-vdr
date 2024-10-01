import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetTransactionRequestOptions = {
  submitterDid?: string
  ledgerType: number
  seqNo: number
}

interface GetTransactionFoundResult extends GetRequestResultFoundBase {
  type: '3'
  data: {
    auditPath: string[]
    txnMetadata: {
      seqNo: number
    }
    txn: {
      metadata: Record<string, unknown>
      data: unknown
      type: string
    }
    rootHash: string
    ver: string
    ledgerSize: number
    reqSignature: Record<string, unknown>
  }
}

interface GetTransactionNotFoundResult extends GetRequestResultNotFoundBase {
  type: '3'
  data: null
}

export type GetTransactionResponse = GetRequestResponse<
  GetTransactionFoundResult,
  GetTransactionNotFoundResult
>

export class GetTransactionRequest extends IndyVdrRequest<GetTransactionResponse> {
  public constructor(options: GetTransactionRequestOptions) {
    const handle = indyVdr.buildGetTxnRequest(options)
    super({ handle })
  }
}
