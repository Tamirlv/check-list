import { Component } from '@angular/core';
import { IsLoggedInService } from './admin/is-logged-in.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn: any;
  user: any;
  isLoggedIn: any;
  constructor(
    public router: Router,
    private isLoggedInService: IsLoggedInService,
    private breakpointObserver: BreakpointObserver,
    private cookieService: CookieService
  ) {
    this.loggedIn = this.isLoggedInService.isAuthenticated()
    if (this.cookieService.get("user")) {
      this.isLoggedInService.setUser(this.cookieService.get("user")),
        this.user = this.cookieService.get("user")
    }
  }
  getTheUser(event: any) {
    this.loggedIn = true
  }
  title = 'CheckListTask';
  isMenuOpen = false;
  isHandset() {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }
  signOut() {
    this.cookieService.delete("userToken")
    this.cookieService.delete("user")
    this.cookieService.delete("permissions")
    this.router.navigate(['/'])
    this.loggedIn = false;
  }
  checkLoggedIn() {
    return this.isLoggedInService.isAuthenticated()
  }
}
