import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type GetValidatorInfoActionOptions = {
  submitterDid: string
}

export type GetValidatorInfoResponse = Record<string, string>

export class GetValidatorInfoAction extends IndyVdrRequest<GetValidatorInfoResponse> {
  public constructor(options: GetValidatorInfoActionOptions) {
    const handle = indyVdr.buildGetValidatorInfoRequest(options)
    super({ handle })
  }
}
