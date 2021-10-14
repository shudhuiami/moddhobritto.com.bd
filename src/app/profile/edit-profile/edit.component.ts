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
  selector: 'app-profile-edit',
  templateUrl: './edit.component.html',
})
export class ProfileEditComponent implements OnInit {
  ENV = environment;
  UserInfo = null;
  loading = false;
  loadingType1 = false;

  updatePassword = {
    old_password: '',
    password: '',
    password_confirmation: ''
  };
  UserInfos: any = {
    visiting_card: null,
  }
  orderStatus = 0;
  orderDetails = [];

  address = [];
  loadingbtn = false;

  editForm: any = {

  };
  deleteFrom = {
    id: ''
  };

  param: any = {
    limit: 20,
  };
  previewImage = null;
  laravelData: any = null;


  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {
    this.getProfiles();
  }

  ngOnInit(): void {
    $(() => {
      $('.orderDetails').click(() => {
        // remove classes from all
        $('.orderDetails').removeClass('active');
        // add class to the one we clicked
        $(this).addClass('active');
      });
    });

  }
  clickFile = (event,type) => {
    $('.upload-file').click();
    this.AttachFile(event, type);
  }
  removeImage = (event, type) => {
    if(type === 1){
      this.UserInfos.visiting_card = null
    }
  }
  AttachFile =  (event, type) => {
    if(type === 1){
      this.loadingType1 = true;
    }else{
      this.loading = true
    }
    const trigger = $(event.target);
    const input = event.target.files[0];
    const formData: any = new FormData();
    // @ts-ignore
    formData.append('module_type', 1);
    // @ts-ignore
    formData.append('media_type', 1);
    formData.append('image', input);
    formData.append('is_public', true);
    this.apiServices.UploadMedia(formData).subscribe(res => {
      if(type === 1){
        this.loadingType1 = false;
      }else{
        this.loading = false
      }
      if (res.status === 2000){
        this.notificationServices.showInfo('Success', res.msg);
        if(type === 1){
          this.UserInfos.visiting_card_full_path = res.data.image_full_path;
        }else{
          this.UserInfo.avatar = res.data.image_full_path;
        }

      }
    });
  }

  getProfiles = () => {
    this.apiServices.getProfile(this.UserInfo).subscribe(res => {
      if (res.status === 2000) {
        this.UserInfo = res.data;
      }
    });
  }


  UpdateProfiles = () => {
    this.loadingbtn = true;
    let userInfo = {
      name: this.UserInfo.name,
      email: this.UserInfo.email,
      phone: this.UserInfo.phone,
      date_of_birth: this.UserInfo.dob,
      profession: this.UserInfo.profession,
      position: this.UserInfo.position,
      business_address: this.UserInfo.business_address,
      visiting_card_full_path: this.UserInfo.visiting_card_full_path,
      avatar: this.UserInfo.avatar,
    }
    this.apiServices.UpdateProfile(userInfo).subscribe(res => {
      this.loadingbtn = false;
      if (res.status === 2000) {
        this.notificationServices.showInfo('Success', 'Update Successful');
        window.location.reload()
        this.getProfiles();
      } else {
        this.ErrorHandaler(res.error);
      }
    });
  }




  ErrorHandaler = (error) => {
    $.each(error, (i, v) => {
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
    });
  }


}
