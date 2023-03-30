import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from '../services/httpService';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
export class HomeComponent implements OnInit {
  experiments: any = [];
  displayedColumns: string[] = ['name', 'country', 'client','incubator', 'eggs', 'created_date', 'experiment_start_date'];
  dataSource: any;
  subscription: Subscription;
  constructor(
    private httpSerivce: HttpService, private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.subscription = this.httpSerivce.getAllExperiment().subscribe((data) => {
      this.experiments = data;
      this.dataSource = this.experiments;
    })
  }
  openNewExperimentDialog() {
    const dialogRef = this.dialog.open(NewExperimentComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('x');
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
  countries = [
    { name: 'Israel', clients: [{ clientName: 'Kidron', incubators: [1, 2, 3] }] },
    { name: 'Italy', clients: [{ clientName: 'Malo', incubators: [1] }] },
    { name: 'Belgium', clients: [{ clientName: 'Kruisem', incubators: [1, 2, 3] }] },
    { name: 'United States', clients: [{ clientName: 'Auburn', incubators: [1, 2] }] }];
  constructor(
    private router: Router,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<NewExperimentComponent>,
  ) { }

  ngOnInit(): void {
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
    this.httpService.addExperiment(newExperiment).subscribe((data) => {
      this.router.navigate(['/experiment/' + data])
      this.dialogRef.close();
    })
  }
}
