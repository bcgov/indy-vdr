import type { IndyVdrRequest } from '@hyperledger/indy-vdr-nodejs'

import { GetSchemaRequest } from '@hyperledger/indy-vdr-nodejs'
import { DID, SCHEMA_ID } from './utils'

describe('IndyVdrRequest', () => {
  let request: IndyVdrRequest

  beforeAll(() => {
    request = new GetSchemaRequest({ schemaId: SCHEMA_ID })
  })

  afterAll(() => request.free())

  test('Get request handle', () => {
    expect(request.handle).toBeGreaterThan(0)
  })

  test('Get request body', () => {
    expect(typeof request.body).toEqual('string')
    expect(JSON.parse(request.body)).toMatchObject({
      identifier: 'LibindyDid111111111111',
      operation: {
        data: { name: 'MyName', version: '1.0' },
        dest: 'J6nTnUo3YLayzc2GUUctb1',
        type: '107',
      },
      protocolVersion: 2,
      reqId: expect.any(Number),
    })
  })

  test('Get request signature input', () => {
    expect(request.signatureInput.split('|')).toEqual(
      expect.arrayContaining([
        'identifier:LibindyDid111111111111',
        'operation:data:name:MyName',
        'version:1.0',
        'dest:J6nTnUo3YLayzc2GUUctb1',
        'type:107',
        'protocolVersion:2',
      ]),
    )
  })

  test('Set request endorser', () => {
    expect(request.setEndorser({ endorser: DID })).toBe(void 0)
  })

  test('Set request signature', () => {
    const signature = new Uint8Array([0])
    expect(request.setSignature({ signature })).toBe(void 0)
  })

  test('Set request multi signature', () => {
    const signature = new Uint8Array([0])
    expect(request.setMultiSignature({ signature, identifier: DID })).toBe(
      void 0,
    )
  })

  test('Set request transaction author agreement acceptance', () => {
    expect(
      request.setTransactionAuthorAgreementAcceptance({
        acceptance: { mechanism: 'foo', taaDigest: 'foo', time: 123 },
      }),
    ).toBe(void 0)
  })
})
