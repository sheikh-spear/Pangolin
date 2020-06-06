import { Component } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "@app/_models";
import { Friend } from "@app/_models";
import { AccountService } from "@app/_services";
import { first } from "rxjs/operators";

@Component({ templateUrl: "home.component.html" })
export class HomeComponent {
  user: User;
  friends: Friend[];

  ngOnInit() {
    this.accountService.getFriends().pipe(first()).subscribe(friends => {
      this.friends = friends;
      console.log(this.friends);
    });
  }

  deleteFriend(id) {
    this.accountService.deleteFriend(id);
  }

  addFriend(id) {
    this.accountService.addFriend(id);
  }
  constructor(private accountService: AccountService) {
    
    this.user = this.accountService.userValue;
  }
}
