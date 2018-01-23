import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { RouterModule, Routes } from '@angular/router';

// Third party libraries
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ElectionComponent } from './election/election.component';
import { ContenderComponent } from './contender/contender.component';
import { ElectionService } from './services/election.service';
import { UserService } from './services/user.service';


const routes: Routes = [
  {
    path: 'election/:eid',
    component: ElectionComponent
  },
  {
    path: '**',
    redirectTo: 'election/asdasd',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ElectionComponent,
    ContenderComponent
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
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
