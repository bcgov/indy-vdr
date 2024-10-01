import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetNymRequestOptions = {
  submitterDid?: string
  dest: string
  seqNo?: number
  timestamp?: number
}

// Get Nym somehow returns the nym data as stringified JSON. It is up to the user of the library
// to parse the stringified JSON.
interface GetNymFoundResult extends GetRequestResultFoundBase {
  type: '105'
  data: string
  dest: string
}

interface GetNymNotFoundResult extends GetRequestResultNotFoundBase {
  type: '105'
  data: null
  dest: string
}

export type GetNymResponse = GetRequestResponse<
  GetNymFoundResult,
  GetNymNotFoundResult
>

export class GetNymRequest extends IndyVdrRequest<GetNymResponse> {
  public constructor(options: GetNymRequestOptions) {
    const handle = indyVdr.buildGetNymRequest(options)
    super({ handle })
  }
}
