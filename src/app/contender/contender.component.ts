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
  photoURL = 'https://pbs.twimg.com/profile_images/800812110888529920/I0pBwxh6_400x400.jpg';



  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.uid = this.contender.uid;
    this.userService.getUserDocument(this.uid).subscribe(user => {
      this.desc = user.desc;
      this.name = user.name;
      this.photoURL = user.photoURL
                        ? user.photoURL : 'https://pbs.twimg.com/profile_images/800812110888529920/I0pBwxh6_400x400.jpg';
    });
  }

}
