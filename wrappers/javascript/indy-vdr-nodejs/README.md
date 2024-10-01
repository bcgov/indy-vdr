# Indy VDR NodeJS

Wrapper for Nodejs around indy-vdr

## Requirements

This library requires (and has been tested extensively with) Node.js version `18.x`. Newer versions might also work, but they have not been tested.

## Installation

```sh
pnpm add @hyperledger/indy-vdr-nodejs
```

## Usage

You can import all types and classes from the `@hyperledger/indy-vdr-nodejs` library:

```typescript
import { PoolCreate, GetSchemaRequest } from '@hyperledger/indy-vdr-nodejs'

const pool = new PoolCreate({
  parameters: {
    transactions: <TRANSACTION_OBJECT>
  }
})

const getSchemaRequest = new GetSchemaRequest({
  schemaId: 'J6nTnUo3YLayzc2GUUctb1:2:MyName:1.0',
})

const schemaResponse = await pool.submitRequest(getSchemaRequest)
```

## Testing

In order to test this library, you need a local indy network running. This can be done with the following commands (from the root of the repository):

```sh
docker build -f ci/indy-pool.dockerfile -t test_pool --build-arg pool_ip=10.0.0.2 ci
docker network create --subnet=10.0.0.0/8 indy-sdk-network
docker run -d --name indy_pool -p 9701-9708:9701-9708 --net=indy-sdk-network test_pool

# Network is now running

cd wrappers/javascript

docker exec $(docker ps -aqf "ancestor=test_pool") cat /var/lib/indy/sandbox/pool_transactions_genesis >> genesis.txn

pnpm test:local
```

> **Note**: If you want to use this library in a cross-platform environment you need to import methods from the `@hyperledger/indy-vdr-shared` package instead. This is a platform independent package that allows to register the native bindings. The `@hyperledger/indy-vdr-nodejs` package uses this package under the hood. See the [Indy VDR Shared README](https://github.com/hyperledger/indy-vdr/tree/main/wrappers/javascript/indy-vdr-shared/README.md) for documentation on how to use this package.

## Version Compatibility

The JavaScript wrapper is versioned independently from the native bindings. The following table shows the compatibility between the different versions:

| Indy VDR      | JavaScript Wrapper |
| ------------- | ------------------ |
| v0.4.0-dev.16 | v0.1.0             |
| v0.4.1        | v0.2.x             |
| v0.4.3        | v0.3.0             |