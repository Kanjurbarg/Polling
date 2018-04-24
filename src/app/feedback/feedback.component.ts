import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  uid;

  feedbackForm = new FormGroup({
    subject : new FormControl('',[Validators.required, Validators.minLength(6)]),
    body : new FormControl('',[Validators.required, Validators.minLength(20), Validators.maxLength(150)])
  });

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder
    
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      this.uid = params.get('uid');
    });

  }

  sendFeedback(formData){
    console.log(formData.value);
    const data={
      subject : formData.get('subject').value,
      body : formData.get('body').value,
      uid: this.uid
    };
    this.userService.feedback(data);
    


  }

}
