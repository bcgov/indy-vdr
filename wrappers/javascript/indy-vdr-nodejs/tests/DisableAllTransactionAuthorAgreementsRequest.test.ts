import { DisableAllTransactionAuthorAgreementsRequest } from '@hyperledger/indy-vdr-nodejs'

import { DID, setupPool } from './utils'

describe('DisableAllTransactionsAuthorAgreementRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new DisableAllTransactionAuthorAgreementsRequest({
      submitterDid: DID,
    })

    await expect(pool.submitRequest(request)).rejects.toThrowError(
      'MissingSignature()',
    )
  })
})
