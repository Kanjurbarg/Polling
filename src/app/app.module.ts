import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import * as firebase from 'firebase';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ElectionComponent } from './election/election.component';
import { ContenderComponent } from './contender/contender.component';

// Services
import { ElectionService } from './services/election.service';
import { UserService } from './services/user.service';


// Third party libraries
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'election/:eid',
    component: ElectionComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ElectionComponent,
    ContenderComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'Scribe'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    ChartsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ElectionService,
    UserService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
