import type { GetRevocationRegistryResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetRevocationRegistryRequest } from '@hyperledger/indy-vdr-nodejs'

import { REVOC_REG_DEF_ID, setupPool } from './utils'

describe('GetRevocationRegistryRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetRevocationRegistryRequest({
      revocationRegistryId: REVOC_REG_DEF_ID,
      timestamp: new Date(),
    })
    const response: GetRevocationRegistryResponse =
      await pool.submitRequest(request)

    expect(response).toMatchObject({ op: 'REPLY' })
  })
})
