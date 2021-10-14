import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';
import {prepareSyntheticPropertyName} from '@angular/compiler/src/render3/util';
import {CustomerActiveAccount} from "../state/store.actions";
import {Store} from "@ngrx/store";
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  ENV = environment;
  UserInfo: any = {};
  name_Input = true;
  phone_Input = true;
  loading = false;

  updatePassword = {
    old_password: '',
    password: '',
    password_confirmation: ''
  };
  orderStatus = 0;
  orderDetails = [];

  address = [];




  editForm: any = {

  };
  deleteFrom = {
    id: ''
  };

  param: any = {
    limit: 20,
  };
  division = [];
  district = [];
  area = [];
  laravelData: any = null;
  AddAddress = {
    title: '',
    name: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    division : '',
    district: '',
    area: '',
  };
  webData: null;
  ActivationCount: any = 0

  // tslint:disable-next-line:max-line-length
  constructor(private store: Store<{store}>, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService, protected helperServices: HelperServices) {
    this.getProfiles();
  }

  ngOnInit(): void {


  }

  openActiveModal = () =>{
    $('#activeAccount').fadeIn()
  }


//Get Profiles
  getProfiles = () => {
    this.loading = true;
    this.apiServices.getProfile('').subscribe(res => {
      if (res.status === 2000) {
        this.UserInfo = res.data;
        this.loading = false;
      }
    });
  }
/*  SendActivationCode = () => {
    /!*this.apiServices.SendActivationCode('').subscribe(res => {
      if (res.status === 2000) {
        let last_send_activation = {date_time: Date.now()}
        localStorage.setItem('_last_send_activation_', JSON.stringify(last_send_activation))
      }
    });*!/
  }*/

}
