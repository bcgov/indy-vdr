import type { GetValidatorInfoResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetValidatorInfoAction } from '@hyperledger/indy-vdr-nodejs'

import { DID, setupPool } from './utils'

describe('GetValidatorInfoAction', () => {
  const pool = setupPool()

  test('Submit action', async () => {
    const action = new GetValidatorInfoAction({ submitterDid: DID })
    const response: GetValidatorInfoResponse = await pool.submitAction(action)

    console.log(response)
    expect(response).toMatchObject({})
  })
})
