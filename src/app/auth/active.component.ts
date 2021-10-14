import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';
import {CustomerAuthStore} from '../state/store.actions';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
})
export class ActiveComponent implements OnInit {
  codeForm = {
    activation_code: '',
  };
  loadingbtn = false;

  constructor(private store: Store<{store}>, private router: Router, protected authServices: AuthServices, protected notificationServices: NotificationService) {

  }
  activeForm = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingbtn = true;

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
