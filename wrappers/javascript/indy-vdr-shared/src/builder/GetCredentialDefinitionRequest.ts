import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetCredentialDefinitionRequestOptions = {
  submitterDid?: string
  credentialDefinitionId: string
}

interface GetCredentialDefinitionFoundResult extends GetRequestResultFoundBase {
  type: '108'
  signature_type: 'CL'
  tag: string
  ref: number
  origin: string
  // TODO: add better typing
  data: {
    primary: Record<string, unknown>
    revocation: Record<string, unknown>
  }
}

interface GetCredentialDefinitionNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '108'
  signature_type: 'CL'
  tag: string
  ref: number
  origin: string
  data: null
}

export type GetCredentialDefinitionResponse = GetRequestResponse<
  GetCredentialDefinitionFoundResult,
  GetCredentialDefinitionNotFoundResult
>

export class GetCredentialDefinitionRequest extends IndyVdrRequest<GetCredentialDefinitionResponse> {
  public constructor(options: GetCredentialDefinitionRequestOptions) {
    const handle = indyVdr.buildGetCredDefRequest(options)
    super({ handle })
  }
}
