import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  testTimeout: 120000,
  moduleNameMapper: {
    '^@hyperledger/indy-vdr-shared$': '<rootDir>/../indy-vdr-shared/src',
    '^@hyperledger/indy-vdr-nodejs$': '<rootDir>/src',
  },
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
}

export default config
