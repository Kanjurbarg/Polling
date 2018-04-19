import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import * as firebase from 'firebase';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ElectionComponent } from './election/election.component';
import { ContenderComponent } from './contender/contender.component';
import { PollsComponent } from './polls/polls.component';
import { VotingComponent } from './voting/voting.component';

// Services
import { ElectionService } from './services/election.service';
import { UserService } from './services/user.service';
import { GroupsService } from './services/groups.service';
import { PollService } from './services/poll.service';

// Third party libraries
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { GroupComponent } from './group/group.component';
import { FooterComponent } from './footer/footer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AccountComponent } from './account/account.component';
import { CoverComponent } from './cover/cover.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'poll/:pid',
    component: PollsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'groups/:gid',
    component: GroupComponent
  },
  {
    path:'voting/:pid',
    component:VotingComponent
  },
  {
    path:'account',
    component :  AccountComponent
  },
  {
    path:'cover',
    component : CoverComponent
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
    DashboardComponent,
    RegisterComponent,
    GroupComponent,
    FooterComponent,
    PollsComponent,
    VotingComponent,
    AccountComponent,
    CoverComponent
  
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'}),
    FormsModule,
    ReactiveFormsModule ,
    NgbModule.forRoot(),
    ChartsModule
  ],
  
  providers: [
    ElectionService,
    UserService,
    AuthService,
    GroupsService,
    PollService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
