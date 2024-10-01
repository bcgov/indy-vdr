import type { GetSchemaResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetSchemaRequest } from '@hyperledger/indy-vdr-nodejs'

import { SCHEMA_ID, setupPool } from './utils'

describe('GetSchemaRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetSchemaRequest({
      schemaId: SCHEMA_ID,
    })
    const response: GetSchemaResponse = await pool.submitRequest(request)

    expect(response).toMatchObject({
      op: 'REPLY',
    })
  })
})
