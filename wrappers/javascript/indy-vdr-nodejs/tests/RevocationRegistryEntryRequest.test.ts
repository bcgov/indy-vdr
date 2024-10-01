import { DID, REVOC_REG_DEF_ID, setupPool } from './utils'

import { RevocationRegistryEntryRequest } from '@hyperledger/indy-vdr-nodejs'

describe('RevocationRegistryEntryRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new RevocationRegistryEntryRequest({
      revocationRegistryDefinitionType: 'CL_ACCUM',
      revocationRegistryDefinitionId: REVOC_REG_DEF_ID,
      revocationRegistryEntry: { value: { accum: 'foo' }, ver: '1.0' },
      submitterDid: DID,
    })

    await expect(pool.submitRequest(request)).rejects.toThrowError(
      'MissingSignature()',
    )
  })
})
