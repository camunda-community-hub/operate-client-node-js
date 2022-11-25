import { OAuthProvider } from "camunda-saas-oauth";
import got from 'got';
import ky from 'ky-universal'
import { ChangeStatus, FlownodeInstance, Incident, ProcessDefinition, ProcessInstance, Query, SearchResults, Variables } from "./APIObjects";

const pkg = require('../../package.json')

const OPERATE_API_VERSION = 'v1'

export class OperateClient {
    oAuthProvider: OAuthProvider;
    userAgentString: string;
    baseUrl: string;
    httpOptions: { prefixUrl: string; };

    constructor({
        baseUrl = 'https://bru-2.operate.camunda.io', 
        oAuthProvider, 
        userAgentString
    }: 
    {
        baseUrl: string, 
        oAuthProvider: OAuthProvider,
        userAgentString: string
    }) {
        this.userAgentString = userAgentString
        this.oAuthProvider = oAuthProvider
        this.baseUrl = baseUrl
        const clusterId = this.oAuthProvider.zeebeAudience.split('.')[0]
        this.httpOptions = {
            prefixUrl: `${this.baseUrl}/${clusterId}/${OPERATE_API_VERSION}`
        }
    }

    private async getHeaders() {
        return {
            'content-type': 'application/json',
            'authorization': `Bearer ${await this.oAuthProvider.getToken('OPERATE')}`,
            'user-agent': this.userAgentString,
            'accept': '*/*'
        }
    }

    public async searchProcessDefinitions(query: Query<ProcessDefinition> = {}): Promise<SearchResults<ProcessDefinition>> {
        const headers = await this.getHeaders()
        return ky.post(`process-definitions/search`, {
            json: query,
            headers,
            ...this.httpOptions
        }).json()
    }

    public async getProcessDefinition(processDefinitionKey: number): Promise<ProcessDefinition> {
        const headers = await this.getHeaders()
        return ky(`process-definitions/${processDefinitionKey}`, {
            headers,
            ...this.httpOptions
        }).json()
    }

    public async getProcessDefinitionXML(processDefinitionKey: number): Promise<string> {
        const headers = await this.getHeaders()
        return ky(`process-definitions/${processDefinitionKey}/xml`, {
            headers,
            ...this.httpOptions
        }).text()
    }

    public async searchProcessInstances(query: Query<ProcessInstance> = {}): Promise<SearchResults<ProcessInstance>> {
        const headers = await this.getHeaders()
        return ky.post(`process-instances/search`, {
            json: query,
            headers,
            ...this.httpOptions
        }).json()
    }

    public async getProcessInstance(processInstanceKey: number): Promise<ProcessInstance> {
        const headers = await this.getHeaders()
        return ky(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.httpOptions
        }).json()
    }

    public async deleteProcessInstance(processInstanceKey: number): Promise<ChangeStatus> {
        const headers = await this.getHeaders()
        return got.delete(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.httpOptions
        }).json()
    }

    public async searchIncidents(query: Query<Incident> = {}): Promise<SearchResults<Incident>> {
        const headers = await this.getHeaders()
        return ky.post(`incidents/search`, {
            json: query,
            headers,
            ...this.httpOptions
        }).json()
    }

    public async getIncident(key: number): Promise<Incident> {
        const headers = await this.getHeaders()
        return got(`incidents/${key}`, {
            headers,
            ...this.httpOptions
        }).json()
    }

    public async searchFlownodeInstances(query: Query<FlownodeInstance>): Promise<SearchResults<FlownodeInstance>> {
        const headers = await this.getHeaders()
        return ky.post(`flownodes/search`, {
            headers,
            ...this.httpOptions,
            json: query
        }).json()
    }

    public async getFlownodeInstance(key: number): Promise<FlownodeInstance> {
        const headers = await this.getHeaders()
        return ky(`flownodes/${key}`, {
            headers,
            ...this.httpOptions
        }).json()        
    }

    public async searchVariables(query: Query<Variables>): Promise<SearchResults<Variables>> {
        const headers = await this.getHeaders()
        return ky.post(`variables/search`, {
            headers,
            json: query,
            ...this.httpOptions
        }).json()
    }

    public async getVariables(key: number): Promise<Variables> {
        const headers = await this.getHeaders()
        return ky(`variables/${key}`, {
            headers,
            ...this.httpOptions
        }).json()
    }
}