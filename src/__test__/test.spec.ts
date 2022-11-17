import { OperateClient } from "../lib/OperateClient";

const c = new OperateClient();


(async () => {
    const defs = await c.getProcessDefinitions()
    console.log(defs)
    expect(defs).toBeTruthy()
    const p = await c.getProcessDefinition(2251799816930533)
    console.log(p)
    expect(p).toBeTruthy()
})()
