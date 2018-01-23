import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contender',
  templateUrl: './contender.component.html',
  styleUrls: ['./contender.component.css']
})
export class ContenderComponent implements OnInit {

  @Input() contender;
  uid;
  desc;
  name;
  photoURL = 'https://am12.akamaized.net/med/cnt/uploads/2017/03/Screen-Shot-2017-03-07-at-1.01.03-PM.png';



  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.uid = this.contender.uid;
    this.userService.getUserDocument(this.uid).subscribe(user => {
      this.desc = user.description;
      this.name = user.name;
    });
  }

}
