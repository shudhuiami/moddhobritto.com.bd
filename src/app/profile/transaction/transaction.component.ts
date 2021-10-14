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
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit {
  ENV = environment;
  param: any = {
    limit:20,
  }
  transData = []
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService, protected helperServices: HelperServices) {
  this.getTransaction()
  }

  ngOnInit(): void {


  }

//Get Profiles
  getTransaction = () => {
    this.apiServices.Transaction(this.param).subscribe(res => {
      if (res.status === 2000) {
        this.transData = res.data;
      }
    });
  }

//  Close Add Address Modal
  closeAddAddressModal = () => {
    $('#addAddress').fadeOut(200);
  };



}
