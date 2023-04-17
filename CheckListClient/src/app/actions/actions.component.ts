import { Component, OnInit, Inject, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpService } from '../services/httpService';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['edit', 'activity', 'approver', 'delete'];
  allActions: any = [];
  dataSource: any;
  page: any = 1;
  totalPages: any;
  number: number = 0;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private httpService: HttpService,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private MatSnackBar: MatSnackBar,

  ) {
    this.dataSource = new MatTableDataSource(this.allActions);
  }

  ngOnInit(): void {
    this.getAllActions();
  }

  ngAfterViewChecked(): void {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = 'Page: ' + this.page + ' of ' + this.totalPages;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  pageChange(event: any) {
    this.number = event.length;
    this.page = event.pageIndex + 1;
    if (event.length % event.pageSize == 0) {
      this.totalPages = event.length / event.pageSize;
    }
    else if (event.length <= event.pageSize) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.round(event.length / event.pageSize) + 1;
    }
  }
  deleteAction(id: string) {
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
      if (result) {
        this.MatSnackBar.open("Action updated successfully", "", { duration: 2000, panelClass: ['bg-success', 'text-white', 'custom-class'], verticalPosition: "bottom" });
        this.getAllActions();
      }
    });
  }
  newAction() {
    const dialogRef = this.dialog.open(addOrEditAction, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MatSnackBar.open(`Action created successfully`, "", { duration: 2000, panelClass: ['bg-success', 'custom-class'], verticalPosition: "bottom" });
        this.getAllActions();
      }
    });
  }
  getAllActions() {
    this.httpService.getAllActions().subscribe((data) => {
      this.allActions = data;
      this.dataSource.data = this.allActions;
      this.dataSource.paginator = this.paginator;
      if (this.allActions.length % 10 == 0) {
        this.totalPages = this.allActions.length / 10;
      } else if (this.allActions.length <= 10) {
        this.totalPages = 1;
      } else {
        this.totalPages = Math.round(this.allActions.length / 10) + 1;
      }
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
  error: any;
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
    const newAction: any = {
      action: form.value.action,
      approver: form.value.approver
    }
    if (this.id) {
      newAction['id'] = this.id
    }
    this.httpService.addOrUpdateAction(newAction).subscribe((data: any) => {
      if (data.error) {
        this.error = data;
      } else {
        this.dialogRef.close({ changesMade: true });
      }
    });
  }
}