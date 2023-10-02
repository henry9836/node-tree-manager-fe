import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NodeInfo} from '../models/app.models';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmDialogComponent} from "../comfirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-db-component',
  templateUrl: './db-component.component.html',
  styleUrls: ['./db-component.component.css']
})

export class DbComponent implements OnInit{
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  private apiUrl : string = "http://localhost:8080/node";

  lastNodeDownloaded : NodeInfo = {
    node_id: -1,
    parent: -1,
    name: "",
    date_created: -1,
    property: []
  }

  dataFromDb: any = "";
  selectedNodePath: string = '';
  newPropertyLabel: string = '';
  newPropertyValue: any;
  newNodeName: string = '';
  nodePaths: string[] = [];

  ngOnInit(): void {
    console.log("DbComponentComponent Init");
    this.updatePredictivePaths();
  }

  // TODO: Add delay to this so you don't spam the backend
  updatePredictivePaths(): void{
    let url = this.apiUrl + "?predictPath=";

    const lastIndex = this.selectedNodePath.lastIndexOf('/');
    const partialFullPath = this.selectedNodePath.substring(0, lastIndex);

    url = url + partialFullPath;

    if (partialFullPath.length == 0) {
      url = url + '/';
    }

    this.http.get<NodeInfo[]>(url)
      .subscribe((response) => {
      if (response && response.length > 0) {
        this.nodePaths = [];
        for (let index = response.length - 1; index >= 0; index--) {
            this.nodePaths.push(partialFullPath + '/' + response[index].name);
        }
      }
      else {
        this.dataFromDb = "Error: Response was invalid"
      }
    });
  }

  getNodeFromPath(): void{
    if (this.selectedNodePath.length == 0){
        return;
    }

    const url = this.apiUrl + "?path=" + this.selectedNodePath;

    this.http.get<NodeInfo[]>(url).subscribe((response) => {
      if (response && response.length > 0) {
        this.lastNodeDownloaded = response[0];

        this.dataFromDb = '';
        for (let index = response.length - 1; index >= 0; index--) {
          const nodeInfo = response[index];
          this.dataFromDb += `*${nodeInfo.name}\n`
          const properties = nodeInfo.property;
          for (const key in properties){
              if (properties.hasOwnProperty(key)){
                const value = properties[key];
                this.dataFromDb += key + ": " + value + '\n';
              }
          }
        }
      }
      else {
        this.dataFromDb = "Error: Response was invalid"
      }
    });
  }
  createNewNode(bShouldCreateRootNode : boolean): void {
    if (this.newNodeName.length == 0){
      return;
    }

    let requestBody = {
      "name" : this.newNodeName,
      "parent" : (bShouldCreateRootNode ? -1 : this.lastNodeDownloaded.node_id),
      "properties" : {}
    };

    // Send POST api request
    this.http.post(this.apiUrl, requestBody).subscribe((response) => {
      console.log(response)
      this.newNodeName = "";
      this.selectedNodePath = '';
      this.lastNodeDownloaded = {
        node_id: -1,
        parent: -1,
        name: "",
        date_created: -1,
        property: []
      }
      this.dataFromDb = "";

      this.updatePredictivePaths();
    });
  }

  addPropertyLocally(): void{
    this.lastNodeDownloaded.property[this.newPropertyLabel] = this.newPropertyValue;
    this.newPropertyLabel = "";
    this.newPropertyValue = "";
  }

  updateNode(): void{

    // const updatedProperties = [];
    // for (const [key, value] of Object.entries(this.lastNodeDownloaded.property)) {
    //   updatedProperties.push({ key, value });
    // }

    let requestBody = {
      "nodeId" : this.lastNodeDownloaded.node_id,
      "properties" : this.lastNodeDownloaded.property
    };

    // Send a PATCH update our node
    this.http.patch(this.apiUrl, requestBody).subscribe(() => {
      this.selectedNodePath = '';
      this.lastNodeDownloaded = {
        node_id: -1,
        parent: -1,
        name: "",
        date_created: -1,
        property: []
      }
      this.dataFromDb = "";
    });
  }

  deleteNode(nodeId : number): void{
    if (nodeId < 0){
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this node?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestBody = {"nodeId" : nodeId};

        // Send DELETE api resquest
        this.http.delete(this.apiUrl, { body: requestBody }).subscribe((response) => {
          this.lastNodeDownloaded = {
            node_id: -1,
            parent: -1,
            name: "",
            date_created: -1,
            property: []
          }
          this.selectedNodePath = '';

          this.dataFromDb = "";

          this.updatePredictivePaths();
        });
      }
    });
  }
}
