export type PoolHandle = number
export type RequestHandle = number

export type Raw = Record<string, unknown>

export type Aml = Record<string, unknown>

export type PoolStatus = {
  mt_root: string
  mt_size: number
  nodes: string[]
}

type Transaction = {
  reqSignature: Record<string | number, unknown>
  txn: {
    data: {
      data: {
        alias: string
        blskey: string
        blskey_pop: string
        client_ip: string
        client_port: string
        node_ip: string
        node_port: number
        services: string[]
      }
      dest: string
    }
    metadata: {
      from: string
    }
    type: string
  }
  txnMetadata: {
    seqNo: number
    txnId: string
  }
  ver: string
}

export type Transactions = Transaction[]

type VerifierInfo = {
  client_addr: string
  node_addr: string
  public_key: string
  enc_key: string
  bls_key?: string
}

export type Verifiers = Record<string, VerifierInfo>

export type PoolSubmitRequestOptions = {
  requestHandle: RequestHandle
  poolHandle: PoolHandle
}

export type PoolSubmitActionOptions = {
  requestHandle: RequestHandle
  poolHandle: PoolHandle
  nodes?: string[]
  timeout?: number
}

export type WriteRequestResultTxnBase = {
  type: string
  data: unknown
  protocolVersion: number
  metadata: {
    taaAcceptance?: {
      mechanism: string
      taaDigest: string
      time: number
    }
    from: string
    reqId: number
    digest: string
    payloadDigest: string
  }
}

export type WriteRequestResponse<
  WriteRequestResultTxn extends WriteRequestResultTxnBase,
> = {
  op: 'REPLY'
  result: {
    rootHash: string
    reqSignature: {
      type: 'ED25519'
      values: Array<{ value: string; from: string }>
    }
    auditPath: string[]
    txn: WriteRequestResultTxn
    ver: string
    txnMetadata: {
      seqNo: number
      txnTime: number
      txnId: string
    }
  }
}

export type GetRequestResultNotFoundBase = {
  reqId: number
  seqNo?: null
  txnTime?: null
  identifier: string
  type: string
  state_proof?: {
    root_hash: string
    multi_signature: {
      value: {
        pool_state_root_hash: string
        state_root_hash: string
        ledger_id: number
        timestamp: number
        txn_root_hash: string
      }
      participants: Array<string>
      signature: string
    }
    proof_nodes: string
  }
}

export type GetRequestResultFoundBase = {
  reqId: number
  seqNo: number
  txnTime: number
  identifier: string
  type: string
  state_proof: {
    root_hash: string
    multi_signature: {
      value: {
        pool_state_root_hash: string
        state_root_hash: string
        ledger_id: number
        timestamp: number
        txn_root_hash: string
      }
      participants: Array<string>
      signature: string
    }
    proof_nodes: string
  }
}

export type GetRequestResponse<
  FoundResult extends GetRequestResultFoundBase,
  NotFoundResult extends GetRequestResultNotFoundBase,
> = {
  op: 'REPLY'
  result: FoundResult | NotFoundResult
}
