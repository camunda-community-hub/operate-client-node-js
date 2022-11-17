import { OAuthProvider } from "camunda-saas-oauth";
import { getCamundaCredentialsFromEnv } from "camunda-8-credentials-from-env"
import got from 'got';

const pkg = require('../../package.json')

const OPERATE_API_VERSION = 'v1'

export class OperateClient {
    oAuthProvider: OAuthProvider;
    creds: { ZEEBE_ADDRESS: string; ZEEBE_CLIENT_ID: string; ZEEBE_CLIENT_SECRET: string; ZEEBE_AUTHORIZATION_SERVER_URL: string; complete: true; };
    userAgentString: string;
    baseUrl: string;
    gotOptions: { prefixUrl: string; };

    constructor(baseUrl: string = 'https://bru-2.operate.camunda.io') {
        this.userAgentString = `operate-client-nodejs/${pkg.version}`
        this.oAuthProvider = new OAuthProvider(this.userAgentString)
        this.baseUrl = baseUrl
        const creds = getCamundaCredentialsFromEnv()
        if (!creds.complete) {
            throw new Error('Operate API Client Credentials in environment not complete set.')
        }
        this.creds = creds
        const clusterId = this.oAuthProvider.zeebeAudience.split('.')[0]
        this.gotOptions = {
            prefixUrl: `${this.baseUrl}/${clusterId}/${OPERATE_API_VERSION}`
        }
    }

    private async getHeaders() {
        return {
            'content-type': 'application/json',
            'authorization': `Bearer ${await this.oAuthProvider.getToken('OPERATE')}`,
            'user-agent': this.userAgentString,
            'accept': 'application/json'
        }
    }

    public async getProcessDefinitions() {
        const headers = await this.getHeaders()
        return got.post(`process-definitions/search`, {
            json: {},
            headers,
            ...this.gotOptions
        }).json()
    }

    public async getProcessDefinition(processDefinitionKey: number) {
        const headers = await this.getHeaders()
        return got(`process-definitions/${processDefinitionKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }
}