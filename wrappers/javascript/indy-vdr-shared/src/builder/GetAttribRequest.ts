import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetAttribRequestOptions = {
  submitterDid?: string
  targetDid: string
  hash?: string
  raw?: string
  enc?: string
  seqNo?: number
  timestamp?: number
}

interface GetAttribFoundResult extends GetRequestResultFoundBase {
  type: '104'
  dest: string
  data: string
  raw?: string
}

interface GetAttribNotFoundResult extends GetRequestResultNotFoundBase {
  type: '104'
  data: null
  dest: string
  raw?: string
}

export type GetAttribResponse = GetRequestResponse<
  GetAttribFoundResult,
  GetAttribNotFoundResult
>

export class GetAttribRequest extends IndyVdrRequest<GetAttribResponse> {
  public constructor(options: GetAttribRequestOptions) {
    const handle = indyVdr.buildGetAttribRequest(options)
    super({ handle })
  }
}
