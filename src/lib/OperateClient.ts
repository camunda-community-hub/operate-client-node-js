import { OAuthProvider } from "camunda-saas-oauth";
import { getCamundaCredentialsFromEnv } from "camunda-8-credentials-from-env"
import got from 'got';
import { ChangeStatus, FlownodeInstance, Incident, ProcessDefinition, ProcessInstance, Query, SearchResults, Variables } from "./APIObjects";

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

    public async searchProcessDefinitions(query: Query<ProcessDefinition> = {}): Promise<SearchResults<ProcessDefinition>> {
        const headers = await this.getHeaders()
        return got.post(`process-definitions/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    public async getProcessDefinition(processDefinitionKey: number): Promise<ProcessDefinition> {
        const headers = await this.getHeaders()
        return got(`process-definitions/${processDefinitionKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    public async getProcessDefinitionXML(processDefinitionKey: number) {
        const headers = await this.getHeaders()
        return got(`process-definitions/${processDefinitionKey}/xml`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    public async searchProcessInstances(query: Query<ProcessInstance> = {}): Promise<SearchResults<ProcessInstance>> {
        const headers = await this.getHeaders()
        return got.post(`process-instances/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    public async getProcessInstance(processInstanceKey: number): Promise<ProcessInstance> {
        const headers = await this.getHeaders()
        return got(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    public async deleteProcessInstance(processInstanceKey: number): Promise<ChangeStatus> {
        const headers = await this.getHeaders()
        return got.delete(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    public async searchIncidents(query: Query<Incident> = {}): Promise<SearchResults<Incident>> {
        const headers = await this.getHeaders()
        return got.post(`incidents/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    public async getIncident(key: number): Promise<Incident> {
        const headers = await this.getHeaders()
        return got(`incidents/${key}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    public async searchFlownodeInstances(query: Query<FlownodeInstance>): Promise<SearchResults<FlownodeInstance>> {
        const headers = await this.getHeaders()
        return got.post(`flownodes/search`, {
            headers,
            ...this.gotOptions,
            json: query
        }).json()
    }

    public async getFlownodeInstance(key: number): Promise<FlownodeInstance> {
        const headers = await this.getHeaders()
        return got(`flownodes/${key}`, {
            headers,
            ...this.gotOptions
        }).json()        
    }

    public async searchVariables(query: Query<Variables>): Promise<SearchResults<Variables>> {
        const headers = await this.getHeaders()
        return got.post(`variables/search`, {
            headers,
            json: query,
            ...this.gotOptions
        }).json()
    }

    public async getVariables(key: number) {
        const headers = await this.getHeaders()
        return got(`variables/${key}`, {
            headers,
            ...this.gotOptions
        }).json()
    }
}