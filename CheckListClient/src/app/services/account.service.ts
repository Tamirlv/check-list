import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { IsLoggedInService } from '../admin/is-logged-in.service';
// import { ApiService } from './api.service'
import { HttpService } from './httpService';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  users: User[] = [];
  constructor(
    private httpService: HttpService,
    private isLoggedInService: IsLoggedInService,
  ) { }
  getUsers() {
    return this.users;
  }

  newUser(user: any, callback: any) {
    this.httpService.newUser(user)
      .subscribe((user: any) => {
        callback(true);
      }, (error: any) => {
        callback(error);
        console.log(error);
      });
  }

  login(us: string, pass: string, callback: any) {
    let loginData = {
      username: us,
      password: pass,
    }
    this.httpService.login(loginData)
      .subscribe((data: any) => {
        if (data.user) {
          console.log(data);
          this.isLoggedInService.setUser(data.user.user);
          this.isLoggedInService.setRole(data.user.permissions);
        }
        if (data.token) this.isLoggedInService.setToken(data.token);
        if (data.message) callback(data.message, null);
        callback(null, data);
      }, (error: any) => {
        callback(error, null);
      });
  }
}
