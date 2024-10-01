import { DID, setupPool } from './utils'

import { CustomRequest } from '@hyperledger/indy-vdr-nodejs'

describe('CustomRequest', () => {
  const pool = setupPool()

  test('Submit request', async () => {
    const request = new CustomRequest({
      customRequest: {
        identifier: DID,
        operation: {
          data: 1,
          from: 1,
          type: '3',
          timestamp: new Date(),
          to: 1,
        },
        protocolVersion: 2,
        reqId: 2,
      },
    })

    await expect(pool.submitRequest(request)).resolves.toMatchObject({
      op: 'REPLY',
    })
  })

  test('Can parse a request from string', () => {
    const json = `{"endorser":"DJKobikPAaYWAu9vfhEEo5","identifier":"2GjxcxqE2XnFrVhipkWCWT","operation":{"dest":"2GjxcxqE2XnFrVhipkWCWT","raw":"{\\"endpoint\\":{\\"endpoint\\":\\"https://example.com/endpoint\\",\\"routingKeys\\":[\\"a-routing-key\\"],\\"types\\":[\\"endpoint\\",\\"did-communication\\",\\"DIDComm\\"]}}","type":"100"},"protocolVersion":2,"reqId":1680599092494999800,"signature":"3RyENWHC1szYH7FwDfZ2pKteShtsuDgYCSjGQGDPDjAYE5mipCZ6AnZKuAgCQYq6yt1LEfPPRKVS8BjBirX5s5q3","taaAcceptance":{"mechanism":"accept","taaDigest":"e546ad2a5311b2020fd80efb4d17ec75f823d26ee2424cf741ee345ede9d3ff3","time":1680566400}}`
    const request = new CustomRequest({
      customRequest: json,
    })

    request.setMultiSignature({
      identifier: 'TL1EaPFCZ8Si5aUrqScBDt',
      signature: Buffer.from('Hello, this is a signature'),
    })

    expect(request.body).toEqual(
      '{"endorser":"DJKobikPAaYWAu9vfhEEo5","identifier":"2GjxcxqE2XnFrVhipkWCWT","operation":{"dest":"2GjxcxqE2XnFrVhipkWCWT","raw":"{\\"endpoint\\":{\\"endpoint\\":\\"https://example.com/endpoint\\",\\"routingKeys\\":[\\"a-routing-key\\"],\\"types\\":[\\"endpoint\\",\\"did-communication\\",\\"DIDComm\\"]}}","type":"100"},"protocolVersion":2,"reqId":1680599092494999800,"signatures":{"2GjxcxqE2XnFrVhipkWCWT":"3RyENWHC1szYH7FwDfZ2pKteShtsuDgYCSjGQGDPDjAYE5mipCZ6AnZKuAgCQYq6yt1LEfPPRKVS8BjBirX5s5q3","TL1EaPFCZ8Si5aUrqScBDt":"3DaTn63KBMjCE8pCLkDvMBFPKHefZiQXyzr8"},"taaAcceptance":{"mechanism":"accept","taaDigest":"e546ad2a5311b2020fd80efb4d17ec75f823d26ee2424cf741ee345ede9d3ff3","time":1680566400}}',
    )
  })
})
