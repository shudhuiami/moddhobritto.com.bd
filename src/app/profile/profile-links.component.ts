import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelperServices} from '../services/helper.service';
import {ApiServices} from '../services/api.services';
import {NotificationService} from '../services/notification.service';

declare let $: any;

@Component({
  selector: 'app-profile-link',
  templateUrl: './profile-links.component.html',
})
export class ProfileLinksComponent implements OnInit{
  // tslint:disable-next-line:max-line-length
   constructor(private router: Router, protected helperServices: HelperServices, protected apiServices: ApiServices, protected notificationServices: NotificationService) {
    this.helperServices.currentWebsiteSettings.subscribe(response => {

    });
    /**
     * get Most Search Data
     *
     */


  }

  ngOnInit(): void{

  }



}
