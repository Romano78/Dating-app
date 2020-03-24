import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;

  model: any;

  constructor(private http: HttpClient, public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {

  }

  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
     this.alertify.success('logged in successfuly');
    }, error => {
      this.alertify.error(error);
    });
  }

  loggedIn() {
   return this.authService.loggedIn();
  }

}
