import type { GetAcceptanceMechanismsResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetAcceptanceMechanismsRequest } from '@hyperledger/indy-vdr-nodejs'

import { setupPool } from './utils'

describe('GetAcceptanceMechanismsRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetAcceptanceMechanismsRequest({})
    const response: GetAcceptanceMechanismsResponse =
      await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
