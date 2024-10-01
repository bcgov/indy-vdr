import type { GetCredentialDefinitionResponse } from '@hyperledger/indy-vdr-nodejs'

import { GetCredentialDefinitionRequest } from '@hyperledger/indy-vdr-nodejs'

import { CRED_DEF_ID, setupPool } from './utils'

describe('GetCredentialDefinitionRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new GetCredentialDefinitionRequest({
      credentialDefinitionId: CRED_DEF_ID,
    })
    const response: GetCredentialDefinitionResponse =
      await pool.submitRequest(request)

    expect(response).toMatchObject({ op: 'REPLY' })
  })
})
