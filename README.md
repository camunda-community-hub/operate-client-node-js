# Operate API Client for Node.js

A Node.js client for interacting with the [Camunda 8 Operate REST API](https://docs.camunda.io/docs/apis-clients/operate-api/).

## Installation

```
npm i operate-api-client
```

## Usage

Set the credentials for Camunda SaaS in the environment, then:

```typescript
import { OperateApiClient } from 'operate-api-client'

const operate = new OperateApiClient()

operate.searchProcessInstances({
    filter: {
        state: "ACTIVE"
    },
    size: 50
}).then(instances => {
    console.log(instances)
})
```

