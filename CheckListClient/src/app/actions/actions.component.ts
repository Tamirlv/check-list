import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { HttpService } from '../services/httpService';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['edit', 'activity', 'approver', 'delete'];
  allActions: any = [];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.dataSource = new MatTableDataSource(this.allActions);
  }

  ngOnInit(): void {
    this.getAllActions();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  deleteAction(id: string) {
    console.log(id);
    this.httpService.deleteAction(id).subscribe((data) => {
      this.getAllActions();
    })
  }
  openDialog(action: any): void {
    const dialogRef = this.dialog.open(addOrEditAction, {
      width: '350px',
      data: action
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllActions();
    });
  }
  newAction() {
    const dialogRef = this.dialog.open(addOrEditAction, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllActions();
    });
  }
  getAllActions() {
    this.httpService.getAllActions().subscribe((data) => {
      this.allActions = data;
      this.dataSource.data = this.allActions;
      this.dataSource.paginator = this.paginator;
    })
  }
  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


@Component({
  selector: 'addOrEditAction',
  templateUrl: 'addOrEditAction.component.html',
})
export class addOrEditAction {
  approver: any;
  action: any;
  id: string;
  edit = false;
  approverOptions = ['Software', 'Hardware', 'Operation']
  constructor(
    private httpService: HttpService,
    public dialogRef: MatDialogRef<addOrEditAction>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.edit = true;
      this.approver = data.approver
      this.action = data.action
      this.id = data._id;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(form: NgForm) {
    console.log(form.value)
    const newAction: any = {
      action: form.value.action,
      approver: form.value.approver
    }
    if (this.id) {
      newAction['id'] = this.id
    }
    this.httpService.addOrUpdateAction(newAction).subscribe((data) => {
      this.dialogRef.close();
    });
  }
}