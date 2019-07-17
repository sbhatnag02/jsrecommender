import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGaurdService } from './services/auth-guard.service';
import { FileUploadComponent } from './file-upload/file-upload.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'nav', component: NavComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGaurdService]},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGaurdService]},
  {path: 'file-upload', component: FileUploadComponent, canActivate: [AuthGaurdService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
