import { registerIndyVdr } from '@hyperledger/indy-vdr-shared'

import { NodeJSIndyVdr } from './NodeJSIndyVdr'
export const indyVdrNodeJS = new NodeJSIndyVdr()
registerIndyVdr({ vdr: indyVdrNodeJS })

export * from '@hyperledger/indy-vdr-shared'
