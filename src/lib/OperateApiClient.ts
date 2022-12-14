import { getOperateToken } from "camunda-saas-oauth";
import { getOperateCredentials } from "camunda-8-credentials-from-env"
import got from 'got';
import { ChangeStatus, FlownodeInstance, Incident, ProcessDefinition, ProcessInstance, Query, SearchResults, Variables } from "./APIObjects";

const pkg = require('../../package.json')

const OPERATE_API_VERSION = 'v1'

/**
 * @description The high-level client for Operate.
 * @example
 * ```
 * const operate = new OperateApiClient()
 * 
 * operate.searchProcessInstances({
 *     filter: {
 *         state: "ACTIVE"
 *     },
 *     size: 50
 * }).then(instances => {
 *     console.log(instances)
 * })
 * ```
 */
export class OperateApiClient {
    private userAgentString: string;
    private gotOptions: { prefixUrl: string; };

    /**
     * @example
     * ```
     * const operate = new OperateApiClient()
     * ```
     */
    constructor() {
        this.userAgentString = `operate-client-nodejs/${pkg.version}`
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

    /**
     * @description Search and retrieve process definitions. 
     * 
     * [Camunda 8 Documentation](https://docs.camunda.io/docs/apis-clients/operate-api/#process-definition)
     * @example
     * ```
     * const query: Query<ProcessDefinition> = {
     *   filter: {},
     *   size: 50,
     *   sort: [
     *     {
     *       field: "bpmnProcessId",
     *       order: "ASC",
     *     },
     *    ],
     *  };
     * const operate = newOperateClient()
     * const defs = await operate.searchProcessDefinitions(query);
     * ```
     */
    public async searchProcessDefinitions(query: Query<ProcessDefinition> = {}): Promise<SearchResults<ProcessDefinition>> {
        const headers = await this.getHeaders()
        return got.post(`process-definitions/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    /**
     * 
     * @description Retrieve the metadata for a specific process definition, by key.  
     * 
     * [Camunda 8 Documentation](https://docs.camunda.io/docs/apis-clients/operate-api/#process-definition)
     * @example
     * ```
     * const operate = new OperateApiClient()
     * const definition = await operate.getProcessDefinition(2251799817140074);
     *  ```
     */
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

    /**
     * @description Search and retrieve process instances.
     * @example 
     * ```
     * const operate = new OperateApiClient()
     * const query: Query<ProcessInstance>  = {
     *   filter: {
     *     processVersion: 1
     *   },
     *   size: 50,
     *   sort: [
     *     {
     *       field: "bpmProcessId",
     *       order: "ASC"
     *     }
     *   ]
     * }
     * const instances = await operate.searchProcessInstances(query)
     * console.log(`Found ${instances.total} instances`)
     */
    public async searchProcessInstances(query: Query<ProcessInstance> = {}): Promise<SearchResults<ProcessInstance>> {
        const headers = await this.getHeaders()
        return got.post(`process-instances/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    /**
     * 
     * @description Retrieve a specific process instance by id. 
     * @example
     * ```
     * const operate = new OperateApiClient()
     * const instance = await operate.getProcessInstance(2251799819847322)
     * ```
     */
    public async getProcessInstance(processInstanceKey: number): Promise<ProcessInstance> {
        const headers = await this.getHeaders()
        return got(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    /**
     * @description Delete a specific process instance by key.
     * @example  
     * ```
     * const operate = new OperateApiClient()
     * await operate.deleteProcessInstance(2251799819847322)
     * ``` 
     */
    public async deleteProcessInstance(processInstanceKey: number): Promise<ChangeStatus> {
        const headers = await this.getHeaders()
        return got.delete(`process-instances/${processInstanceKey}`, {
            headers,
            ...this.gotOptions
        }).json()
    }

    /**
     * 
     * @description Search and retrieve incidents. 
     * @example
     * ```
     * const operate = new OperateApiClient()
     * const query: Query<Incident> = {
     *   filter: {
     *     state: "ACTIVE"
     *   },
     *   size: 50,
     *   sort: [
     *     {
     *       field: "creationTime",
     *       order: "ASC"
     *     }
     *   ]
     * }
     * const incidents = operate.searchIncidents(query)
     * ``` 
     */
    public async searchIncidents(query: Query<Incident> = {}): Promise<SearchResults<Incident>> {
        const headers = await this.getHeaders()
        return got.post(`incidents/search`, {
            json: query,
            headers,
            ...this.gotOptions
        }).json()
    }

    /**
     * 
     * @description Retrieve an incident by incident key. 
     * @example
     * ```
     * const operate = new OperateApiClient()
     * const incident = await operate.getIncident(2251799818436725)
     * console.log(incident.message)
     * ``` 
     */
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