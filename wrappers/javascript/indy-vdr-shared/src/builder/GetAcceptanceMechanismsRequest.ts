import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetAcceptanceMechanismsRequestOptions = {
  timestamp?: Date
  submitterDid?: string
  version?: string
}

interface GetAcceptanceMechanismsFoundResult extends GetRequestResultFoundBase {
  type: '7'
  data: {
    version: string
    amlContext: string
    aml: Record<string, string>
  }
}

interface GetAcceptanceMechanismsNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '7'
  data: null
}

export type GetAcceptanceMechanismsResponse = GetRequestResponse<
  GetAcceptanceMechanismsFoundResult,
  GetAcceptanceMechanismsNotFoundResult
>

export class GetAcceptanceMechanismsRequest extends IndyVdrRequest<GetAcceptanceMechanismsResponse> {
  public constructor(options: GetAcceptanceMechanismsRequestOptions) {
    const handle = indyVdr.buildGetAcceptanceMechanismsRequest(options)
    super({ handle })
  }
}
