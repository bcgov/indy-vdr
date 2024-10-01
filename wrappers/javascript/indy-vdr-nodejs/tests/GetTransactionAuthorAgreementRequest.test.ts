import type { GetTransactionAuthorAgreementResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetTransactionAuthorAgreementRequest } from '@hyperledger/indy-vdr-nodejs'

import { setupPool } from './utils'

describe('GetTransactionAuthorAgreementRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetTransactionAuthorAgreementRequest({})
    const response: GetTransactionAuthorAgreementResponse =
      await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
