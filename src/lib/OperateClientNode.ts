import { OAuthProvider } from "camunda-saas-oauth";
import { OperateClient } from "./OperateClient";
import { getCamundaCredentialsFromEnv } from "camunda-8-credentials-from-env"
const pkg = require('../../package.json')

export class OperateClientNode extends OperateClient {
    constructor(baseUrl = 'https://bru-2.operate.camunda.io') {
        const userAgentString = `operate-client-nodejs/${pkg.version}`
        const oAuthProvider = new OAuthProvider(userAgentString);
        const creds = getCamundaCredentialsFromEnv()
        if (!creds.complete) {
            throw new Error('Operate API Client Credentials in environment not complete set.')
        }
        super({
            userAgentString, 
            oAuthProvider, 
            baseUrl
        })
        
    }
}