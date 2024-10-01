import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetRevocationRegistryRequestOptions = {
  submitterDid?: string
  revocationRegistryId: string
  timestamp: Date
}

interface GetRevocationRegistryFoundResult extends GetRequestResultFoundBase {
  type: '116'
  data: {
    seqNo: number
    value: {
      accum: string
    }
    revocRegDefId: string
    txnTime: number
    revocDefType: 'CL_ACCUM'
  }
  revocRegDefId: string
}

interface GetRevocationRegistryNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '116'
  data: null
  revocRegDefId: string
}

export type GetRevocationRegistryResponse = GetRequestResponse<
  GetRevocationRegistryFoundResult,
  GetRevocationRegistryNotFoundResult
>
export class GetRevocationRegistryRequest extends IndyVdrRequest<GetRevocationRegistryResponse> {
  public constructor(options: GetRevocationRegistryRequestOptions) {
    const handle = indyVdr.buildGetRevocRegRequest(options)
    super({ handle })
  }
}
