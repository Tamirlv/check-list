import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IsLoggedInService } from './is-logged-in.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: IsLoggedInService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAuth:boolean = this.authService.isAuthenticated();
      if (isAuth) {
        return true
      } else {
        this.router.navigate(['/'], {
          queryParams: {
            auth: false
          }
        })
        return false
      }

  }
  
}
