import type { GetTransactionResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetTransactionRequest } from '@hyperledger/indy-vdr-nodejs'

import { setupPool } from './utils'

describe('GetTransactionRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetTransactionRequest({ ledgerType: 1, seqNo: 1 })
    const response: GetTransactionResponse = await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
