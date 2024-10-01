import type { WriteRequestResponse, WriteRequestResultTxnBase } from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type RevocationRegistryDefinitionRequestOptions = {
  submitterDid: string
  revocationRegistryDefinitionV1: RevocationRegistryDefinitionV1
}

type RevocationRegistryDefinitionV1 = {
  ver: '1.0'
  id: string
  revocDefType: 'CL_ACCUM'
  tag: string
  credDefId: string
  value: RevocationRegistryDefinitionValue
}

type RevocationRegistryDefinitionValue = {
  issuanceType: 'ISSUANCE_BY_DEFAULT' | 'ISSUANCE_ON_DEMAND'
  maxCredNum: number
  publicKeys: {
    accumKey: {
      z: string
    }
  }
  tailsHash: string
  tailsLocation: string
}
interface RevocationRegistryDefinitionResultTxn
  extends WriteRequestResultTxnBase {
  type: '113'
  data: {
    id: string
    value: RevocationRegistryDefinitionValue
    credDefId: string
    revocDefType: 'CL_ACCUM'
    tag: string
  }
}

export type RevocationRegistryDefinitionResponse =
  WriteRequestResponse<RevocationRegistryDefinitionResultTxn>

export class RevocationRegistryDefinitionRequest extends IndyVdrRequest<RevocationRegistryDefinitionResponse> {
  public constructor(options: RevocationRegistryDefinitionRequestOptions) {
    const handle = indyVdr.buildRevocRegDefRequest(options)
    super({ handle })
  }
}
