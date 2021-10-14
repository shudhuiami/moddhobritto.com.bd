import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../../services/api.services';
import {HelperServices} from '../../services/helper.service';
import {AuthServices} from '../../services/auth.services';
import {NotificationService} from '../../services/notification.service';
import {prepareSyntheticPropertyName} from '@angular/compiler/src/render3/util';

declare let $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {

  ENV = environment;

  updatePassword = {
    old_password: '',
    password: '',
    password_confirmation: ''
  };

  loadingbtn = false;




  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {

  }

  ngOnInit(): void {
    $(function() {

    });

  }




  //  Update Password
  UpdatePassword = () => {
    this.loadingbtn = true;
    this.apiServices.ChangePassword(this.updatePassword).subscribe(res => {
      this.loadingbtn = false;
      if (res.status === 2000) {
        this.notificationServices.showInfo('Success', 'Password Updated');
      } else {
        this.ErrorHandaler(res.error);
      }
    });
  };



  ErrorHandaler(error) {
    $.each(error, function(i, v) {
      $('[name=' + i + ']').closest('.input-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.input-group').find('.invalid-feedback').html(v);
    });
  }

  ErrorHandaler2(error) {
    $.each(error, function(i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.create-form').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }

}
