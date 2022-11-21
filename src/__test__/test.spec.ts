import { ProcessDefinition, ProcessInstance, Query } from "../lib/APIObjects";
import { OperateClient } from "../lib/OperateClient";

const c = new OperateClient();

test("It can search process definitions", async () => {
  const query: Query<ProcessDefinition> = {
    filter: {},
    size: 50,
    sort: [
      {
        field: "bpmnProcessId",
        order: "ASC",
      },
    ],
  };
  const defs = await c.searchProcessDefinitions(query);
  //   console.log(defs);
  expect(defs.total).toBeGreaterThanOrEqual(0);
});

test("It can get a specific process definition", async () => {
  const p = await c.getProcessDefinition(2251799817140074);
  //   console.log(p);
  expect(p).toBeTruthy();
});

test("It can get the process definition XML", async () => {
  const p = await c.getProcessDefinitionXML(2251799817140074);
    console.log(p);
  expect(p).toBeTruthy();
});

test("It can search for process instances", async () => {
  const query: Query<ProcessInstance> = {
    filter: {
      processVersion: 1,
    },
    size: 50,
    sort: [
      {
        field: "bpmnProcessId",
        order: "ASC",
      },
    ],
  };
  const defs = await c.searchProcessInstances(query);
  expect(defs).toBeTruthy();
  const d = await c.searchProcessInstances({});
  expect(d).toBeTruthy();
});

test("It can find a specific process instance", async () => {
  const query: Query<ProcessInstance> = {
    filter: {
      processVersion: 1,
      key: 2251799818436131,
    },
    size: 50,
    sort: [
      {
        field: "bpmnProcessId",
        order: "ASC",
      },
    ],
  };
  const defs = await c.searchProcessInstances(query);
  expect(defs).toBeTruthy();
});

test("It can get a specific process instance", async () => {
  const p = await c.getProcessInstance(2251799818436131);
  expect(p).toBeTruthy();
});

test("It can find incidents", async () => {
  const is = await c.searchIncidents();
  expect(is).toBeTruthy();
});

test("It can get a specific incident", async () => {
  const i = await c.getIncident(2251799818436725);
  expect(i).toBeTruthy();
});
