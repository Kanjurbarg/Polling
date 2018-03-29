import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectionService } from '../services/election.service';
import { AuthService } from '../services/auth.service'
import { groupDetails } from '../models/groups.model'
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  gName;
  gDescription;
  gAdmin;
  gDate:Date;
  gMembers:String[];
  gid;
  admin;
  gTitle;
  adminID

  //group info
  groupInfo=[];

    constructor(
    private afs:AngularFirestore,
    private router:Router,
    private GS: GroupsService,
    private auth: AuthService,
    private route:ActivatedRoute,
    private US:UserService
  ) { }

  ngOnInit() {

    this.auth.getAuthState().subscribe(user=>{
      this.admin=user.uid;
    })

    //Get the router parameter
    this.route.paramMap.subscribe(params => {
      this.gid = params.get('gid');
      console.log("Group ID "+this.gid);
    });

    //get group information
    this.GS.getGroups(this.gid).subscribe(groups => {
      this.gTitle = groups.title;
      this.gDescription = groups.description;
      this.gDate = groups.createdOn;
      this.adminID = groups.admin;
      this.US.getUserDocument(this.adminID).subscribe(admin=>{
          this.gAdmin = admin.display_name;
      })
    });

    
   
  }
 
  logout(){
    this.auth.logout();
  }
 

}
