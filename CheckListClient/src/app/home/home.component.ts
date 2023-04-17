import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from '../services/httpService';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  experiments: any = [];
  displayedColumns: string[] = ['name', 'country', 'client', 'incubator', 'eggs', 'created_date', 'experiment_start_date'];
  dataSource: any;
  currentPageIndex = 0;
  totalItems: any = 0;
  pageSize: any = 0;
  subscription: Subscription;
  page: any = 1;
  totalPages: any;
  number: number = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private httpSerivce: HttpService, private router: Router,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(this.experiments);
  }

  ngOnInit(): void {
    this.subscription = this.httpSerivce.getAllExperiment().subscribe((data) => {
      this.experiments = data;
      this.experiments.reverse();
      this.dataSource.data = this.experiments;
      this.dataSource.paginator = this.paginator;
      if (this.experiments.length % 10 == 0) {
        this.totalPages = this.experiments.length / 10;
      } else if (this.experiments.length <= 10) {
        this.totalPages = 1;
      } else {
        this.totalPages = Math.round(this.experiments.length / 10) + 1;
      }
    })
  }
  ngAfterViewChecked(): void {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = 'Page: ' + this.page + ' of ' + this.totalPages;
  }
  pageChange(event: any) {
    this.number = event.length;
    this.page = event.pageIndex + 1;
    if (event.length % event.pageSize == 0)
      this.totalPages = event.length / event.pageSize;
    else if (event.length <= event.pageSize)
      this.totalPages = 1;
    else
      this.totalPages = Math.round(event.length / event.pageSize) + 1;
  }

  getPageNumbers() {
    const startIndex = this.currentPageIndex > 0 ? this.currentPageIndex * this.pageSize + 1 : 1;
    const endIndex = Math.min((this.currentPageIndex + 1) * this.pageSize, this.totalItems);
    return `${startIndex} - ${endIndex} of ${this.totalItems}`;
  }
  applyFilter(event: any) {
    const filtered = this.experiments.filter((exp: any) => exp.experiment_name.toLowerCase().includes(event.value.toLowerCase()) || exp.country.toLowerCase().includes(event.value.toLowerCase()))
    this.dataSource.data = filtered;
  }

  openNewExperimentDialog() {
    const dialogRef = this.dialog.open(NewExperimentComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  selector: 'app-new-experiment',
  templateUrl: './new-experiment.component.html',
  styleUrls: ['./new-experiment.component.css']
})
export class NewExperimentComponent implements OnInit {
  experimentName: string;
  experimentPredictedDate: Date;
  equipmentType: string;
  country: any;
  client: any;
  incubator: any;
  eggs: number;
  error: any;
  date: any;
  countries = [
    { name: 'Israel', clients: [{ clientName: 'Kidron', incubators: [1, 2, 3] }] },
    { name: 'Italy', clients: [{ clientName: 'Malo', incubators: [1] }] },
    { name: 'Belgium', clients: [{ clientName: 'Kruisem', incubators: [1, 2, 3] }] },
    { name: 'USA', clients: [{ clientName: 'Auburn', incubators: [1, 2] }] }];
  constructor(
    private router: Router,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<NewExperimentComponent>,
    private MatSnackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.date = new Date();
  }

  countryChanged(event: any) {
    this.client = null;
    this.incubator = null;
  }
  clientChanged(event: any) {
    this.incubator = null;
  }

  onSubmit(form: NgForm) {
    let newExperiment = {
      experiment_name: form.value.experimentName,
      experiment_predicted_date: form.value.experimentPredictedDate,
      equipment_type: form.value.equipmentType,
      eggs: parseInt(form.value.eggs),
      country: form.value.country.name,
      client: form.value.client.clientName,
      incubator: parseInt(this.incubator)
    }
    this.httpService.addExperiment(newExperiment).subscribe((data: any) => {
      console.log(data);
      if (!data.error) {
        this.router.navigate(['/experiment/' + data])
        this.MatSnackBar.open(`Experiment created successfully`, "", { duration: 2000, panelClass: ['bg-success', 'custom-class'], verticalPosition: "bottom" });
        this.dialogRef.close();
      } else {
        this.error = data;
      }
    })
  }
}
