# Operate API Client for Node.js

 [![NPM](https://nodei.co/npm/operate-api-client.png)](https://npmjs.org/package/operate-api-client) 

![Community Extension](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)

![Lifecycle](https://img.shields.io/badge/Lifecycle-Stable-brightgreen)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

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

