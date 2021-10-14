import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiServices} from '../services/api.services';
import {CustomerAuthStore} from '../state/store.actions';
import {Store} from '@ngrx/store';
import {NotificationService} from '../services/notification.service';


@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
})
export class SocialComponent implements OnInit {
  constructor(protected route: ActivatedRoute, protected apiServices: ApiServices, private store: Store<{store}>, protected router: Router, protected notificationServices: NotificationService) {
  }
  ngOnInit(): void {
    this.getProfiles();
  }
  getProfiles = () => {
    this.apiServices.getProfileInfoByToken(this.route.snapshot.queryParamMap.get('token')).subscribe(res => {
      if (res.status === 2000) {
        let Auth_token = this.route.snapshot.queryParamMap.get('token');
        const data = {
          token: Auth_token,
          user: res.data
        };
        this.store.dispatch(CustomerAuthStore({data: data}));
        this.notificationServices.showInfo('Success', 'Login Successful');

        const userData = JSON.stringify(res.data);
        localStorage.removeItem('guest_user_id');

        localStorage.setItem('userData', userData);
        localStorage.setItem("token", Auth_token);

        setTimeout(() => {
          this.router.navigate(['/'], );
        }, 500);
      }
    });
  }

}
