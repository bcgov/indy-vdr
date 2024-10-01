import { IndyVdrRequest, indyVdr } from '../indyVdr'

export type DisableAllTransactionAuthorAgreementsRequestOptions = {
  submitterDid: string
}

// TODO: add response type. This call is probably never used, so it's not a priority.
export class DisableAllTransactionAuthorAgreementsRequest extends IndyVdrRequest {
  public constructor(
    options: DisableAllTransactionAuthorAgreementsRequestOptions,
  ) {
    const handle = indyVdr.buildDisableAllTxnAuthorAgreementsRequest(options)
    super({ handle })
  }
}
