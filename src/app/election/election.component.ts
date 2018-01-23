import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { ElectionService } from '../services/election.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit {

  isInvalid: boolean;

  electionid;
  election;
  contenders = [];
  status;
  topic;

  constructor (
    private afs: AngularFirestore,
    private electionService: ElectionService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.electionid = this.router.url.slice(10);
    this.electionService.getElection(this.electionid).subscribe(
      election => {
        if (election) {
          this.isInvalid = false;
          this.election = election;
          this.status = election.status;
          this.topic = election.topic;
          this.electionService.getContenders(this.electionid).subscribe(
            contenders => {
              this.contenders = contenders;
            });
        } else {
          this.isInvalid = true;
        }
      });
  }

}
