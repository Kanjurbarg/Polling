import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { PollService } from '../services/poll.service'

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {

  topic;
  description;
  status;
  contenders=[];
  voters=[];


  constructor(
    private router:Router,
    private PS:PollService
  ) { }

  ngOnInit() {

    this.PS.getPoll().subscribe(poll=>{

      console.log(poll);

    });


  }

}
