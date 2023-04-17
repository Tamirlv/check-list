import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ExperimentComponent } from '../experiment/experiment.component';

@Injectable()
export class MyGuard1 implements CanDeactivate<ExperimentComponent> {
    canDeactivate(component: ExperimentComponent): Observable<boolean> | boolean {
        if (component.checkListPropertyHasChanged || component.calibrationPropertyHasChanged) { // Check if the property has changed
            return confirm('There is unsaved data, Are you sure you want to leave?'); // Ask the user if they are sure
        }
        return true; // Allow deactivation if there are no unsaved changes
    }
}