import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username = 'user';
  password = '';
  invalidLogin = false;

  constructor(private router: Router, private login: AuthenticationService) { }

  ngOnInit() {
  }

  checkLogin(){
    if(this.login.authenticate(this.username, this.password)){
      this.router.navigate(['/dashboard']);
      this.invalidLogin = false;
    }else{
      this.invalidLogin = true;
    }
  }

}
