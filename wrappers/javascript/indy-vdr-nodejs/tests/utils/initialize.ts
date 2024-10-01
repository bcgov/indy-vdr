import { PoolCreate } from '@hyperledger/indy-vdr-nodejs'

import { genesisTxnPath } from './fixtures'

export const setupPool = () => {
  return new PoolCreate({ parameters: { transactions_path: genesisTxnPath } })
}
