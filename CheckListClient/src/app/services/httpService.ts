import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core'
@Injectable({
    providedIn: 'root'
})

export class HttpService {
    constructor(
        private http: HttpClient,
    ) {

    }

    getAllExperiment() {
        return this.http.get('http://localhost:3000/experiment/getExperiments');
    }
    getExperiment(id: string) {
        const params = new HttpParams().set('id', id)
        return this.http.get('http://localhost:3000/experiment/getExperiment', { params })
    }
    getActionsForExperiment(id: any) {
        const params = new HttpParams().set('id', id)
        return this.http.get('http://localhost:3000/actions', { params })
    }
    getAllActions() {
        return this.http.get('http://localhost:3000/actions')
    }
    addOrUpdateAction(action: any) {
        const params = new HttpParams().set('action', action)
        return this.http.put('http://localhost:3000/actions/addOrEdit', { params })
    }
    deleteAction(id: string) {
        const params = new HttpParams().set('id', id)
        return this.http.delete('http://localhost:3000/actions/delete', { params })
    }
    addExperiment(exp: any) {
        return this.http.post('http://localhost:3000/experiment/newExperiment', { exp })
    }
    updateActions(id: string, actions: any) {
        const body = {
            experiment_id: id,
            actions
        }
        return this.http.put('http://localhost:3000/experiment/updateActions', body)
    }
    getSoositoryExperiments(country: string, client: string) {
        const params = new HttpParams()
            .set('country', country)
            .set('client', client)
        return this.http.get('http://localhost:3000/soository/getExperiments', { params });
    }
    getExperimentTests(id: string) {
        const params = new HttpParams().set('id', id)
        return this.http.get('http://localhost:3000/experiment/getExperimentTests', { params })
    }
    updateCalibration(calibrations: any, id: string) {
        const body = {
            calibrations: calibrations,
            experiment_id: id,
        }
        return this.http.put('http://localhost:3000/calibration/UpdateCalibration', body)
    }
    newUser(input: any) {
        return this.http.post('http://localhost:3000/users/newuser', input);
    }
    login(input: any) {
        return this.http.post('http://localhost:3000/users/logIn', input);
    }
    getSoositorySpecificExperiments(country: string, client: string, data: string) {
        const params = new HttpParams()
            .set('country', country)
            .set('client', client)
            .set('data', data)
        return this.http.get('http://localhost:3000/soository/getSpecificExperiments', { params });
    }
}