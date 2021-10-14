import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';
import {Store} from '@ngrx/store';
import {CustomerAuthStore} from '../state/store.actions';

declare let $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  signupForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  };
  loadingbtn = false;

  constructor(private store: Store<{store}>, private router: Router, protected authServices: AuthServices, protected notificationServices: NotificationService) {
  }

  // Register
  SubmitRegister = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingbtn = true;
    let guest_user_id = localStorage.getItem( 'guest_user_id');
    if(guest_user_id != null){
      this.signupForm['guest_user_id'] = guest_user_id;
    }
    this.authServices.register(this.signupForm).subscribe(res => {
        this.loadingbtn = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', 'Register Successful')

          let data = {
            token: res.data.token,
            user: res.data.userInfo
          }
          this.store.dispatch(CustomerAuthStore({data: data}))

          const userData = JSON.stringify(res.data.userInfo);

          localStorage.removeItem('guest_user_id')
          localStorage.setItem("userData", userData);
          localStorage.setItem("token", res.data.token);

          setTimeout(() => {
            this.router.navigate(['/'], );
          },500)
        } else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  };

  ErrorHandaler(errors) {
    $.each(errors, function(i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }

  ngOnInit(): void {
    $('.category-nav').removeClass('show');

  }

}
