import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Subject } from 'rxjs'
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {
  users: User[] = [];
  user: string = '';
  permissions: string = '';
  token: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private cookieService: CookieService
  ) {
  }
  isAuthenticated() {
    // console.log(this.cookieService.check('userToken'));
    if (this.cookieService.check('userToken')) return true;
    else return false;
  }
  isUserLoggedIn = new Subject();
  setIsLoggedIn(loggedIn: boolean) {
    this.isLoggedIn = loggedIn;
    return this.isUserLoggedIn.next(loggedIn);
  }
  getUser() {
    return this.user;
  }
  getRole() {
    return this.permissions;
  }
  getToken() {
    return this.token;
  }
  setUser(user: string) {
    this.user = user;
    this.cookieService.set("user", this.user, { expires: new Date(Number(new Date()) + 12000000) })
  }
  setRole(permissions: string) {
    this.permissions = permissions;
    this.cookieService.set("permissions", this.permissions, { expires: new Date(Number(new Date()) + 12000000) })
  }
  setToken(token: any) {
    this.token = token;
    this.cookieService.set('userToken', this.token, { expires: new Date(Number(new Date()) + 12000000) })
  }


}