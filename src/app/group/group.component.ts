import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { ElectionService } from '../services/election.service';

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
  gid="Pqg0xhD1dI23EhGoGhir";
  gMembers:String[];
  groups;
    constructor(
    private afs:AngularFirestore,
    private router:Router,
    private GS: GroupsService
  ) { }

  ngOnInit() {
    this.GS.getGroups(this.gid).subscribe(group=>{
      console.log(group);
      this.groups=group;
      this.gName=this.groups.name;
      this.gDescription=this.groups.description;
      this.gAdmin=this.groups.admin;
      this.gDate=this.groups.createdOn;
      
      this.gMembers=this.groups.members;
      //

    });
  }

}
