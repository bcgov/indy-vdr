import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetRevocationRegistryDefinitionRequestOptions = {
  submitterDid?: string
  revocationRegistryId: string
}

interface GetRevocationRegistryDefinitionFoundResult
  extends GetRequestResultFoundBase {
  type: '115'
  data: {
    value: {
      issuanceType: 'ISSUANCE_BY_DEFAULT' | 'ISSUANCE_ON_DEMAND'
      tailsHash: string
      maxCredNum: number
      publicKeys: {
        accumKey: {
          z: string
        }
      }
      tailsLocation: string
    }
    revocDefType: 'CL_ACCUM'
    id: string
    credDefId: string
    tag: string
  }
}

interface GetRevocationRegistryDefinitionNotFoundResult
  extends GetRequestResultNotFoundBase {
  type: '115'
  data: null
  id: string
}

export type GetRevocationRegistryDefinitionResponse = GetRequestResponse<
  GetRevocationRegistryDefinitionFoundResult,
  GetRevocationRegistryDefinitionNotFoundResult
>

export class GetRevocationRegistryDefinitionRequest extends IndyVdrRequest<GetRevocationRegistryDefinitionResponse> {
  public constructor(options: GetRevocationRegistryDefinitionRequestOptions) {
    const handle = indyVdr.buildGetRevocRegDefRequest(options)
    super({ handle })
  }
}
