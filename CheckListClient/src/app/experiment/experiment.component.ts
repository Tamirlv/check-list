import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpService } from '../services/httpService';
import { ViewChild } from '@angular/core';
import { IsLoggedInService } from '../admin/is-logged-in.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('softwarePaginator') softwarePaginator: MatPaginator;
  @ViewChild('hardwarePaginator') hardwarePaginator: MatPaginator;
  @ViewChild('operationPaginator') operationPaginator: MatPaginator;
  @ViewChild('stepper') stepper: MatStepper;
  title: string;
  description: string;
  displayedColumns: string[] = ['activity', 'comment', 'check'];
  displayedCalibrationColumns: string[] = ['experimentName', 'Incubator', 'experimentDate', 'check'];
  actions: any = [];
  experiments: any = [];
  id: any;
  country: string;
  client: string;
  experiment: any;
  calibrationDataSource: any;
  calibrationTests: any;
  experiments1: any;
  role: string;
  user;
  actionsObj: any = {};
  stepper1: any;
  // softwareActions: any = []
  softwareActionsDataSource: any;
  hardwareActionsDataSource: any;
  operationActionsDataSource: any;
  totalActions: number;
  checkedActions: number = 0;
  percent: any = 0;
  constructor(
    private httpSerivce: HttpService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private MatSnackBar: MatSnackBar,
  ) {

    this.calibrationDataSource = new MatTableDataSource(this.calibrationTests);
    this.softwareActionsDataSource = new MatTableDataSource(this.actionsObj.software)
    this.hardwareActionsDataSource = new MatTableDataSource(this.actionsObj.hardware)
    this.operationActionsDataSource = new MatTableDataSource(this.actionsObj.operation)
    this.user = this.cookieService.get('user');
    this.actionsObj = {
      software: [],
      hardware: [],
      operation: []
    }

  }

  tamir(event: any) {
    // this.stepper.selectedIndex = 0;
  }
  ngOnInit(): void {
    this.stepper1 = this.stepper;
    this.id = this.route.snapshot.paramMap.get('id');
    this.httpSerivce.getActionsForExperiment(this.id).subscribe((data: any) => {
      this.actions = data[0].actions;
      this.totalActions = this.actions.length
      this.actions.forEach((action: any) => {
        if (action.checked)
          this.checkedActions++;
        switch (action.activity.approver) {
          case "Software":
            this.actionsObj.software.push(action);
            break;
          case "Hardware":
            this.actionsObj.hardware.push(action);
            break;
          case "Operation":
            this.actionsObj.operation.push(action);
            break;
        }
      });
      this.percent = this.checkedActions / this.totalActions * 100;
      this.softwareActionsDataSource.data = this.actionsObj.software;
      this.softwareActionsDataSource.paginator = this.softwarePaginator;
      this.hardwareActionsDataSource.data = this.actionsObj.hardware;
      this.hardwareActionsDataSource.paginator = this.hardwarePaginator;
      this.operationActionsDataSource.data = this.actionsObj.operation;
      this.operationActionsDataSource.paginator = this.operationPaginator;
      this.httpSerivce.getExperiment(this.id).subscribe((data: any) => {
        this.country = data.country;
        this.client = data.client;
        this.httpSerivce.getSoositoryExperiments(this.country, this.client).subscribe((data: any) => {
          const ans = data.data.reverse();
          this.experiments = ans;
          this.experiments1 = ans;
        })
      })
    })
    this.httpSerivce.getExperimentTests(this.id).subscribe((data) => {
      this.calibrationTests = data;
      this.calibrationDataSource.data = this.calibrationTests;
      this.calibrationDataSource.paginator = this.paginator;
    })
  }
  onCommentChange(event: any, element: any) {
    element.comment = event.target.value
  }
  tamir1() {
    console.log(this.stepper.selectedIndex);
  }
  update() {
    this.httpSerivce.updateActions(this.id, this.actions).subscribe((data) => {
      if (data) {
        this.MatSnackBar.open(`CheckList updated successfully`, "", { duration: 2000, panelClass: ['bg-success', 'custom-class'], verticalPosition: "bottom" });
        this.checkedActions = 0;
        this.actions.forEach((action: any) => {
          action.checked ? this.checkedActions++ : null;
        })
        this.percent = this.checkedActions / this.totalActions * 100;
      }
    })
  }
  addExperiment(exp: any) {
    if (exp.incubators.smart) {
      const obj = {
        soository_exp: exp,
        report: '',
        chosen: false
      };
      this.calibrationTests.push(obj);
      this.calibrationDataSource.data = this.calibrationTests;
      this.experiments = this.experiments.filter((experiment: any) => { return experiment != exp })
      this.experiment = "";
    } else {
      alert('bad soository exp');
    }
  }
  updateCalibration() {
    this.httpSerivce.updateCalibration(this.calibrationTests, this.id).subscribe((data) => {
      if (data) {
        this.MatSnackBar.open(`Calibration table updated successfully`, "", { duration: 2000, panelClass: ['bg-success', 'custom-class'], verticalPosition: "bottom" });
      }
    })
  }
  onKey(input: any) {
    const value = input.value;
    if (value.length) {
      if (value.length > 2) {
        this.httpSerivce.getSoositorySpecificExperiments(this.country, this.client, value).subscribe((data: any) => {
          this.experiments = data.data;
        })
      }
    } else {
      this.experiments = this.experiments1;
    }
  }
  onCheck(check: any) {
    check.checked = !check.checked;
    if (check.checked) {
      check.checked_by = this.user;
    } else {
      check.checked_by = "";
    }
  }
  filteredReturn() {

  }
  tam() {
  }
}
