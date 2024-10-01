import type { GetNymResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetNymRequest } from '@hyperledger/indy-vdr-nodejs'

import { DID, setupPool } from './utils'

describe('GetNymRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetNymRequest({ dest: DID })
    const response: GetNymResponse = await pool.submitRequest(request)

    expect(response).toMatchObject({ op: 'REPLY' })
  })
})
