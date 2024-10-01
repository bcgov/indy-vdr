import type { WriteRequestResponse, WriteRequestResultTxnBase } from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

type ClRevocationRegistryDelta = {
  prevAccum?: string
  accum: string
  issued: Array<number>
  revoked: Array<number>
}

export type RevocationRegistryEntryRequestOptions = {
  submitterDid: string
  revocationRegistryDefinitionId: string
  revocationRegistryDefinitionType: string
  revocationRegistryEntry: {
    ver: '1.0'
    value: ClRevocationRegistryDelta | Record<string, unknown>
  }
}

interface RevocationRegistryEntryResultTxn extends WriteRequestResultTxnBase {
  type: '114'
  data: {
    value: ClRevocationRegistryDelta | Record<string, unknown>
    revocRegDefId: string
    revocDefType: 'CL_ACCUM'
  }
}

export type RevocationRegistryEntryResponse =
  WriteRequestResponse<RevocationRegistryEntryResultTxn>

export class RevocationRegistryEntryRequest extends IndyVdrRequest<RevocationRegistryEntryResponse> {
  public constructor(options: RevocationRegistryEntryRequestOptions) {
    const handle = indyVdr.buildRevocRegEntryRequest(options)
    super({ handle })
  }
}
