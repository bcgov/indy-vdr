import type { IndyVdrPool } from '@hyperledger/indy-vdr-nodejs'

import { PoolCreate } from '@hyperledger/indy-vdr-nodejs'
import { genesisTxnPath } from './utils'

describe('IndyVdrPool', () => {
  let pool: IndyVdrPool

  beforeAll(() => {
    pool = new PoolCreate({
      parameters: { transactions_path: genesisTxnPath },
    })
  })

  test('Get pool handle', () => {
    expect(pool.handle).toBeGreaterThan(0)
  })

  test('Get pool transactions', async () => {
    await expect(pool.transactions).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reqSignature: expect.any(Object),
          txn: {
            data: expect.any(Object),
            metadata: expect.any(Object),
            type: expect.any(String),
          },
          txnMetadata: {
            seqNo: expect.any(Number),
            txnId: expect.any(String),
          },
          ver: expect.any(String),
        }),
      ]),
    )
  })

  test('Get pool status', async () => {
    await expect(pool.status).resolves.toMatchObject({
      mt_root: expect.any(String),
      mt_size: expect.any(Number),
      nodes: expect.any(Array),
    })
  })

  test('Get pool verifiers', async () => {
    const verifiers = await pool.verifiers

    expect(Object.values(verifiers)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          client_addr: expect.any(String),
          node_addr: expect.any(String),
          public_key: expect.any(String),
          enc_key: expect.any(String),
        }),
      ]),
    )
  })
})
