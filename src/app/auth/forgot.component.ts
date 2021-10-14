import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CustomerAuthStore} from "../state/store.actions";
import {NotificationService} from "../services/notification.service";
import {AuthServices} from "../services/auth.services";
import {Store} from "@ngrx/store";
declare let $: any;
@Component({
  selector: 'app-reset',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent implements OnInit  {
  loadingbtn = false;
  requestForm = {
    email : ''
  };
  constructor( private store: Store<{store}>, private router: Router, protected authServices: AuthServices, protected notificationServices: NotificationService) {

  }

  request = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingbtn = true;
    this.authServices.forgot(this.requestForm).subscribe(res => {
        this.loadingbtn = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', 'Request Successful');
          this.router.navigate(['/reset-password'], {state: {email: this.requestForm.email}});
        } else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  };
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
