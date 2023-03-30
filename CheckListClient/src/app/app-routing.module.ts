import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionsComponent } from './actions/actions.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewExperimentComponent } from './new-experiment/new-experiment.component';
import { AdminGuard } from './admin/admin.guard';
const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AdminGuard]
  },
  {
    path: 'experiment/:id', component: ExperimentComponent, canActivate: [AdminGuard]
  },
  {
    path: 'actions', component: ActionsComponent, canActivate: [AdminGuard]
  },
  {
    path: 'newExperiment', component: NewExperimentComponent, canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
