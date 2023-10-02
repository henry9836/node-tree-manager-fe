import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NodeInfo} from '../models/app.models';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

@Component({
  selector: 'app-node-view-component',
  templateUrl: './node-view-component.component.html',
  styleUrls: ['./node-view-component.component.css']
})

export class NodeViewComponent implements OnInit{

  @ViewChild('visNetwork') visNetwork!: ElementRef;
  private networkInstance: any;

  constructor(private http: HttpClient) {}

  nodeTreeData : NodeInfo[] = [];
  selectedRootNode : NodeInfo = {
    node_id: -1,
    parent: -1,
    name: "",
    date_created: -1,
    property: []
  }
  selectedNode : NodeInfo = {
    node_id: -1,
    parent: -1,
    name: "",
    date_created: -1,
    property: []
  }
  rootNodes : NodeInfo[] = [];
  private apiUrl : string = "http://localhost:8080/node";

  ngOnInit(): void {
    this.getNodeTree();
  }

  getNodeTree() : void {
    let url = this.apiUrl + "?getAllTrees=true"
    this.http.get<NodeInfo[]>(url).subscribe((response) => {
      // Update our NodeTree Array
      this.nodeTreeData = [];
      this.rootNodes = [];

      if (response && response.length > 0) {
        for (let index = 0; index < response.length; index++){
          const nodeInfo : NodeInfo = response[index];
          console.log(response[index])
          this.nodeTreeData.push(nodeInfo);
          if (nodeInfo.parent == -1){
            this.rootNodes.push(nodeInfo);
          }
        }

        this.selectedRootNode = this.rootNodes[0];
        this.updateNodeTreeVisuals();
      }
    });
  }

  updateSelectedNode(nodeId : number) : void{
    let node : NodeInfo = {
      node_id: -1,
      parent: -1,
      name: "",
      date_created: -1,
      property: []
    }

    for (let Index = 0; Index < this.nodeTreeData.length; Index++) {
      if (nodeId == this.nodeTreeData[Index].node_id){
        node = this.nodeTreeData[Index];
        break;
      }
    }

    this.selectedNode = node;
  }

  isGreenProperty(value: any): boolean {
    console.log(typeof value === 'number' && value > 10)
    return typeof value === 'number' && value > 10;
  }

  onRootNodeSelectionChanged(): void{
    this.updateNodeTreeVisuals();
  }

  updateNodeTreeVisuals() : void {
    let parents : number[] = [];

    const nodes = new DataSet<any>([
      { id: this.selectedRootNode.node_id, label: this.selectedRootNode.name }
    ]);

    const edges = new DataSet<any>();

    // Get all nodes that are a part of our selected root's node tree and add them to the dataset
    for (let index = 0; index < this.nodeTreeData.length; index++){
      const nodeInfo : NodeInfo = this.nodeTreeData[index];

      // If our nodes has another node with the id of our current node's parent
      // then add it to our nodes dataset
      if (nodes.get(nodeInfo.parent)){
        nodes.add({id: nodeInfo.node_id, label: nodeInfo.name});
        edges.add({from: nodes.get(nodeInfo.parent)?.id, to: nodeInfo.node_id});
      }
    }

    // Update visuals
    const data = { nodes, edges };
    const container = this.visNetwork;

    // https://visjs.github.io/vis-network/docs/network/
    this.networkInstance = new Network(container.nativeElement, data, {
      layout: {
        hierarchical:{
          enabled: true,
          direction: "UD",
          sortMethod: "directed"
        }
      },
      physics:{
        enabled: true,
        hierarchicalRepulsion: {
          avoidOverlap: 1,
        }
      },
      interaction:{
        selectable: true,
        selectConnectedEdges: false
      }
    });

    // https://visjs.github.io/vis-network/docs/network/#Events
    // Bind click interaction
    this.networkInstance.on('selectNode', (event : any) => {
      this.updateSelectedNode(event.nodes);
    });
  }

}
