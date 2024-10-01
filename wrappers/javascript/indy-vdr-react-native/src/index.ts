import type { NativeBindings } from './NativeBindings'

import { registerIndyVdr } from '@hyperledger/indy-vdr-shared'
import { NativeModules } from 'react-native'

import { ReactNativeIndyVdr } from './ReactNativeIndyVdr'

export * from '@hyperledger/indy-vdr-shared'

const module = NativeModules.IndyVdr as { install: () => boolean }
if (!module.install()) throw Error('Unable to install the turboModule: indyVdr')

declare let _indy_vdr: NativeBindings

// This can already check whether `_indy_vdr` exists on global
// eslint-disable-next-line @typescript-eslint/no-use-before-define
if (!_indy_vdr) {
  throw Error(
    '_indy_vdr has not been exposed on global. Something went wrong while installing the turboModule',
  )
}

registerIndyVdr({ vdr: new ReactNativeIndyVdr(_indy_vdr) })
