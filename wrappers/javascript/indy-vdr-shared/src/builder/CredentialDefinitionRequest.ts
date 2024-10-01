import type { WriteRequestResponse, WriteRequestResultTxnBase } from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type CredentialDefinitionRequestOptions = {
  submitterDid: string
  credentialDefinition: {
    ver: '1.0'
    id: string
    /** this must be the stringified seqNo, not the schemaId string */
    schemaId: string
    type: 'CL'
    tag: string
    value: {
      primary: Record<string, unknown>
      revocation?: unknown
    }
  }
}

interface CredentialDefinitionResultTxn extends WriteRequestResultTxnBase {
  type: '102'
  data: {
    data: {
      primary: Record<string, unknown>
      revocation?: unknown
    }
    signature_type: 'CL'
    ref: number
    tag: string
  }
}

export type CredentialDefinitionResponse =
  WriteRequestResponse<CredentialDefinitionResultTxn>

export class CredentialDefinitionRequest extends IndyVdrRequest {
  public constructor(options: CredentialDefinitionRequestOptions) {
    const handle = indyVdr.buildCredDefRequest(options)
    super({ handle })
  }
}
