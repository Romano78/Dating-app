import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs/public_api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-cards',
  templateUrl: './member-cards.component.html',
  styleUrls: ['./member-cards.component.css']
})
export class MemberCardsComponent implements OnInit {

  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserService,
              private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
  }


  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id)
    .subscribe(data => {
      this.alertify.success('You have liked:' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }

}
