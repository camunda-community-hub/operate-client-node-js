import { getOperateToken } from "camunda-saas-oauth";
import { getOperateCredentials } from "camunda-8-credentials-from-env"
import got from 'got';
import { ChangeStatus, FlownodeInstance, Incident, ProcessDefinition, ProcessInstance, Query, SearchResults, Variables } from "./APIObjects";

const pkg = require('../../package.json')

const OPERATE_API_VERSION = 'v1'

export class OperateApiClient {
    userAgentString: string;
    baseUrl: string;
    gotOptions: { prefixUrl: string; };

    constructor(baseUrl: string = 'https://bru-2.operate.camunda.io') {
        this.userAgentString = `operate-client-nodejs/${pkg.version}`
        this.baseUrl = baseUrl
        const creds = getOperateCredentials()
        this.gotOptions = {
            prefixUrl: `${creds.CAMUNDA_OPERATE_BASE_URL}/${OPERATE_API_VERSION}`
        }
    }

    private async getHeaders() {
        return {
            'content-type': 'application/json',
            'authorization': `Bearer ${await getOperateToken(this.userAgentString)}`,
            'user-agent': this.userAgentString,
            'accept': '*/*'
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

    public async getProcessDefinitionXML(processDefinitionKey: number): Promise<string> {
        const headers = await this.getHeaders()
        return got(`process-definitions/${processDefinitionKey}/xml`, {
            headers,
            ...this.gotOptions
        }).text()
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

    public async getVariables(key: number): Promise<Variables> {
        const headers = await this.getHeaders()
        return got(`variables/${key}`, {
            headers,
            ...this.gotOptions
        }).json()
    }
}