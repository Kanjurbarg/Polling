import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contender',
  templateUrl: './contender.component.html',
  styleUrls: ['./contender.component.css']
})
export class ContenderComponent implements OnInit {

  @Input() results;
  @Input() contender;
  @Input() contenders;
  @Input() rank;
  uid;
  desc;
  name;
  photoURL;
  username;
  totalVotes;
  userDocs;


  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log(this.results);
    this.uid = this.results.cid;
    this.totalVotes = this.results.votes;
    this.userService.getUserDocument(this.uid).subscribe(userDoc=>{
      console.log(userDoc);
      this.name = userDoc.display_name;
      this.username = userDoc.username;
      this.photoURL = userDoc.photoURL;
    });

  }

}
