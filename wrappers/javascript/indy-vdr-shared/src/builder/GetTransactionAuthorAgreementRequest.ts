import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetTransactionAuthorAgreementRequestOptions = {
  submitterDid?: string
  data?: string
}

interface GetTransactionAuthorAgreementFoundResult
  extends GetRequestResultFoundBase {
  type: '6'
  data: {
    ratification_ts: number
    digest: string
    version: string
    text: string
  }
}

interface GetTransactionAuthorAgreementNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '6'
  data: null
}

export type GetTransactionAuthorAgreementResponse = GetRequestResponse<
  GetTransactionAuthorAgreementFoundResult,
  GetTransactionAuthorAgreementNotFoundResult
>

export class GetTransactionAuthorAgreementRequest extends IndyVdrRequest<GetTransactionAuthorAgreementResponse> {
  public constructor(options: GetTransactionAuthorAgreementRequestOptions) {
    const handle = indyVdr.buildGetTxnAuthorAgreementRequest(options)
    super({ handle })
  }
}
