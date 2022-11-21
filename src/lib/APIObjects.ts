export interface ProcessDefinition {
  key: number;
  name: string;
  version: number;
  bpmnProcessId: string;
}

export interface ProcessInstance {
  key: number;
  processVersion: number;
  bpmnProcessId: string;
  parentKey?: number;
  /* yyyy-MM-dd'T'HH:mm:ss.SSSZZ */
  startDate: string;
  /* yyyy-MM-dd'T'HH:mm:ss.SSSZZ */
  endDate: string;
  state: string;
  processDefinitionKey: number;
}

export interface Incident {
  key: number;
  processDefinitionKey: number;
  processInstanceKey: number;
  type: string;
  message: string;
  /* yyyy-MM-dd'T'HH:mm:ss.SSSZZ */
  creationTime: string; //
  state: string;
}

export interface FlownodeInstance {
  key: number;
  processInstanceKey: number;
  /* yyyy-MM-dd'T'HH:mm:ss.SSSZZ */
  startDate: string;
  /* yyyy-MM-dd'T'HH:mm:ss.SSSZZ */
  endDate: string;
  incidentKey: number;
  type: string;
  state: string;
  incident: boolean;
}

export interface Variables {
  key: number;
  processInstanceKey: number;
  scopeKey: number;
  name: string;
  /* Always truncated if value is too big in "search" results. In "get object" result it is not truncated. */
  value: string;
  /* if true 'value' is truncated. */
  truncated: boolean;
}

export interface ChangeStatus {
  /* What was changed */
  message: string;
  /* How many items were deleted */
  deleted: number;
}

export interface Query<T> {
  filter?: Partial<T>;
  size?: number;
  sort?: [{ field: keyof T; order: "ASC" | "DESC" }];
  searchAfter?: any[];
}

export interface SearchResults<T> {
  items: T[]
  sortValues: any[],
  total: number
}