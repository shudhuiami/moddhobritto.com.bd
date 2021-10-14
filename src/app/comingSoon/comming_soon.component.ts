import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';

declare let $: any;

@Component({
  selector: 'app-comming_soon',
  templateUrl: './comming_soon.component.html',
})
export class comming_soonComponent implements OnInit {
  ENV = environment;
  background = 1;
  days:any = 0;
  hours:any = 0;
  minutes:any = 0;
  seconds:any = 0;
  shop_slug:any = '';

  constructor(private router: Router, private http: HttpClient,  private route: ActivatedRoute, ) {
    this.shop_slug = this.route.snapshot.paramMap.get('slug');
  }
  ngOnInit(): void {
    if(this.shop_slug == 'event-hour'){ this.background = 2 }
    if(this.shop_slug == 'tour-spot'){ this.background = 1 }
    if(this.shop_slug == 'moto-maxx'){ this.background = 3 }
    const timeToBeReach = new Date("Jun 1, 2021 00:00:00").getTime();
    const updateCountDown = setInterval(() => {
      const now = new Date().getTime();
      const timeDistance = timeToBeReach - now;
      this.days = Math.floor(timeDistance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDistance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDistance % (1000 * 60)) / 1000);
    }, 1000);
  }



}
