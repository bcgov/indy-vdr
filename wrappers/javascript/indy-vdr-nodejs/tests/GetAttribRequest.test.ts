import type { GetAttribResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetAttribRequest } from '@hyperledger/indy-vdr-nodejs'

import { DID, setupPool } from './utils'

describe('GetAttribRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetAttribRequest({ targetDid: DID, raw: 'endpoint' })
    const response: GetAttribResponse = await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
