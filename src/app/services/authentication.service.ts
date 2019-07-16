import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClientModule) { }

  users = ['user1', 'user2', 'user3'];
  passwords = ['password', 'password', 'password'];

  authenticate(username, password) {
    const userIndex = this.users.indexOf(username);
    if (userIndex == -1) {
      return false;
    } else {
      if (password == this.passwords[userIndex]) {
        sessionStorage.setItem('username', username);
        return true;
      }
    }
    // if (username === "user" && password === "password") {
    //   sessionStorage.setItem('username', username);
    //   return true;
    // } else {
    //   return false;
    // }
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }
}
