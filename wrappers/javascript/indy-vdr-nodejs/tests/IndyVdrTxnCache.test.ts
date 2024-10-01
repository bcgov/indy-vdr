import type {
  GetTransactionResponse,
  IndyVdrPool,
} from '@hyperledger/indy-vdr-nodejs'

import { genesisTxnPath } from './utils'

import { accessSync, rmSync } from 'node:fs'
import { PoolCreate } from '@hyperledger/indy-vdr-nodejs'
import { GetTransactionRequest, indyVdr } from '@hyperledger/indy-vdr-shared'

describe('IndyVdrTxnCache', () => {
  let pool: IndyVdrPool

  beforeAll(() => {
    indyVdr.setLedgerTxnCache({
      capacity: 100,
      expiry_offset_ms: 60 * 60 * 1000,
      path: 'txn-cache',
    })
    pool = new PoolCreate({ parameters: { transactions_path: genesisTxnPath } })
  })

  afterAll(() => {
    rmSync('txn-cache', { force: true, recursive: true })
  })

  test('Get pool handle', () => {
    let accessed = false
    try {
      accessSync('txn-cache')
      accessed = true
    } catch {}
    expect(accessed).toBe(true)
  })

  test('Submit GetTxn request', async () => {
    const request = new GetTransactionRequest({ ledgerType: 1, seqNo: 1 })
    const response: GetTransactionResponse = await pool.submitRequest(request)

    const requestCached = new GetTransactionRequest({ ledgerType: 1, seqNo: 1 })
    const responseCached: GetTransactionResponse =
      await pool.submitRequest(requestCached)
    expect(response).toMatchObject(responseCached)
  })
})
