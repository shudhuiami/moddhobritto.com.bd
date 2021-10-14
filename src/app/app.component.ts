import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterOutlet
} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'moddobritto';
  showLoader: boolean = true;
  constructor(private router: Router){
    router.events.subscribe( (routerEvent: RouterEvent) => {
      this.checkRouteChange(routerEvent);
    });
  };
  checkRouteChange( routerEvent:RouterEvent){
    this.showLoader = true;
    setTimeout(() => {
      this.showLoader = false;
    },1000)
  }
}
