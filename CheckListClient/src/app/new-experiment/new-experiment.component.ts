import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/httpService';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
    private httpService: HttpService
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
    console.log(newExperiment);
    this.httpService.addExperiment(newExperiment).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/experiment/' + data])
    })
  }
}
