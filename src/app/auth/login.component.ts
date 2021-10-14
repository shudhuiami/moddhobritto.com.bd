import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';
import {CustomerAuthStore} from '../state/store.actions';
import {Store} from '@ngrx/store';
import {environment} from '../../environments/environment';

declare let $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  ENV = environment;
  signInForm = {
    email: '',
    password: '',
    remember: false
  };
  loadingbtn = false;

  constructor(private store: Store<{store}>, private router: Router, protected authServices: AuthServices, protected notificationServices: NotificationService) {

  }
  checkValue(event: any){
   this.signInForm.remember = event;
    console.log(this.signInForm.remember)
  }

  signIn = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingbtn = true;
    let guest_user_id = localStorage.getItem( 'guest_user_id');
    if(guest_user_id != null){
     this.signInForm['guest_user_id'] = guest_user_id;
    }
    this.authServices.login(this.signInForm).subscribe(res => {
      this.loadingbtn = false;
        if (res.status === 2000) {

          let data = {
            token: res.data.token,
            user: res.data.userInfo
          }
          this.store.dispatch(CustomerAuthStore({data: data}))

          this.notificationServices.showInfo('Success', 'Login Successful')

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
  onSubmit(msg) {
    this.router.navigate(['/login']);
  }
  ErrorHandaler(error) {
    $.each(error, function(i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }
  ngOnInit(): void {
    $('.category-nav').removeClass('show');
  }

}
