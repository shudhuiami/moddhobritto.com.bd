import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  Auth = null;
  $store: any = null;
  constructor(private store: Store<{store}>) {
    /*this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })*/
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
