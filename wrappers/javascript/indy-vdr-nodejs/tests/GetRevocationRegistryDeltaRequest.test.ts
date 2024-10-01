import type { GetRevocationRegistryDeltaResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetRevocationRegistryDeltaRequest } from '@hyperledger/indy-vdr-nodejs'

import { REVOC_REG_DEF_ID, setupPool } from './utils'

describe('GetRevocationRegistryDeltaRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetRevocationRegistryDeltaRequest({
      revocationRegistryId: REVOC_REG_DEF_ID,
      toTs: 1,
    })
    const response: GetRevocationRegistryDeltaResponse =
      await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
