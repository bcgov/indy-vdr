import { TransactionAuthorAgreementRequest } from '@hyperledger/indy-vdr-nodejs'

import { DID, setupPool } from './utils'

describe('TransactionAuthorAgreementRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new TransactionAuthorAgreementRequest({
      submitterDid: DID,
      version: 'TODO',
    })

    await expect(pool.submitRequest(request)).rejects.toThrowError(
      'MissingSignature()',
    )
  })
})
