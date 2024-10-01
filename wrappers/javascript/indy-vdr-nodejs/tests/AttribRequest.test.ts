import { DID, setupPool } from './utils'

import { AttribRequest } from '@hyperledger/indy-vdr-nodejs'

describe('AttribRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new AttribRequest({
      submitterDid: DID,
      targetDid: DID,
      raw: '{ "endpoint": { "ha": "127.0.0.1:5555" } }',
    })

    await expect(pool.submitRequest(request)).rejects.toThrowError(
      'MissingSignature()',
    )
  })
})
