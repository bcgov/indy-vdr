import { IndyVdrPool, indyVdr } from '../indyVdr'

export type PoolCreateOptions = {
  parameters: {
    transactions?: string
    transactions_path?: string
    node_weights?: Record<string, number>
  }
}

export class PoolCreate extends IndyVdrPool {
  public constructor(options: PoolCreateOptions) {
    const handle = indyVdr.poolCreate(options)
    super({ handle })
  }
}
