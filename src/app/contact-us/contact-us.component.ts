import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from "../services/notification.service";

declare let $: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
})
export class contactUsComponent implements OnInit {
  ENV = environment;
  webData = null;
  loading = false
  formData: any = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
  constructor( private router: Router, private http: HttpClient,  private route: ActivatedRoute, protected helperServices: HelperServices, protected AuthServices: AuthServices, protected apiServices: ApiServices, protected notificationServices: NotificationService) {
    this.helperServices.currentWebsiteSettings.subscribe(response => {
      if (response !== null) {
        this.webData = response;
      }
    });
  }
  ngOnInit(): void {

  }


map = () =>{
}

  SendMessage = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loading = true;
    this.apiServices.contactUs(this.formData).subscribe(res => {
        this.loading = false;
        if (res.status === 2000) {
          this.formData = {
            name: '',
            email: '',
            subject: '',
            message: '',
          }
          this.notificationServices.showInfo('Success', 'Message sent Successful')
        } else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  };
  ErrorHandaler = (error) => {
    $.each(error, function(i, v) {
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }
}
