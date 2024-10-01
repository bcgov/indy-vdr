import type {
  GetRequestResponse,
  GetRequestResultFoundBase,
  GetRequestResultNotFoundBase,
} from '../types'

import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetSchemaRequestOptions = {
  submitterDid?: string
  schemaId: string
}

interface GetSchemaFoundResult extends GetRequestResultFoundBase {
  type: '107'
  dest: string
  data: {
    version: string
    attr_names: string[]
    name: string
  }
}

// If a schema is not found, the data attribute is still populated, the attr_names is just empty
interface GetSchemaNotFoundResult extends GetRequestResultNotFoundBase {
  type: '107'
  dest: string
  data: {
    version: string
    name: string
  }
}

export type GetSchemaResponse = GetRequestResponse<
  GetSchemaFoundResult,
  GetSchemaNotFoundResult
>

export class GetSchemaRequest extends IndyVdrRequest<GetSchemaResponse> {
  public constructor(options: GetSchemaRequestOptions) {
    const handle = indyVdr.buildGetSchemaRequest(options)
    super({ handle })
  }
}
