export interface NodeInfo {
  node_id: number;
  parent: number;
  name: string;
  date_created: any;
  property: {
    [key: string]: any;
  };
}
