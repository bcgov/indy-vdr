import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetRevocationRegistryDeltaRequestOptions = {
  submitterDid?: string
  revocationRegistryId: string
  fromTs?: number
  toTs: number
}

interface GetRevocationRegistryDeltaFoundResult
  extends GetRequestResultFoundBase {
  type: '117'
  to: number
  from?: number
  data: {
    value: {
      accum_to: {
        seqNo: number
        value: {
          accum: string
        }
        revocRegDefId: string
        revocDefType: 'CL_ACCUM'
        txnTime: number
      }
      revoked: number[]
      issued: number[]
    }
  }
  revocRegDefId: string
}

interface GetRevocationRegistryDeltaNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '117'
  data: null
  to: number
  from?: number
  revocRegDefId: string
}

export type GetRevocationRegistryDeltaResponse = GetRequestResponse<
  GetRevocationRegistryDeltaFoundResult,
  GetRevocationRegistryDeltaNotFoundResult
>

export class GetRevocationRegistryDeltaRequest extends IndyVdrRequest<GetRevocationRegistryDeltaResponse> {
  public constructor(options: GetRevocationRegistryDeltaRequestOptions) {
    const handle = indyVdr.buildGetRevocRegDeltaRequest(options)
    super({ handle })
  }
}
