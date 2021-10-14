import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../../services/api.services';
import {HelperServices} from '../../services/helper.service';
import {NotificationService} from '../../services/notification.service';
import {AuthServices} from '../../services/auth.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-proceed',
  templateUrl: './proceed.component.html',
})
export class ProceedComponent implements OnInit {


  Auth = null;

  paymentChecked: any = false;

  $store: any = null;
  constructor(private store: Store<{store}>, private router: Router, private http: HttpClient, protected apiService: ApiServices, protected authServices: AuthServices, private route: ActivatedRoute, protected helperServices: HelperServices, protected notificationServices: NotificationService) {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })

  }

  ngOnInit(): void {

    if (this.Auth == null) {
      this.router.navigate(['/login']);
    }
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }




}
