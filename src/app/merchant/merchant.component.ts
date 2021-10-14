import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {AuthServices} from '../services/auth.services';
import {NotificationService} from '../services/notification.service';
import {newArray} from "@angular/compiler/src/util";

declare let $: any;

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
})
export class merchantComponent implements OnInit {
  ENV = environment;
  loadingBtn = false;
  imageLoading = false;
  MerchantForm: any = {
    full_name: '',
    position_in_company: '',
    email: '',
    phone: '',
    nid_no: '',
    etin_no: '',
    bank_name: '',
    shop_name: '',
    shop_address: '',
    shop_type: '',
    notes: '',
    business_email: '',
    business_no_1: '',
    business_no_2: '',
    shop_logo: null,
    business_age: '',
    trade_license_no: '',
    bin_no: '',
    website_link: '',
    instagram_link: '',
    youtube_link: '',
    account_holder_name: '',
    rocket_no: '',
    account_no: '',
    bkash_no: '',
    nagad_no: '',
    shop_banner: null,
    owner_photo: null,
    owner_nid: null,
    guardian_nid: null,
    whatsapp_no: '',
    etin_certificate: null,
    bin_certificate: null,
    current_address: '',
    permanent_address: '',
    facebook_link: '',
    visiting_card: null,
    nid_image: null,
    trade_license:null,
  };
  loadingType = new Array(9).fill(0)
  imagePreview = new Array(9).fill(null)
  shop = [];

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute,
              protected apiServices: ApiServices, protected authServices: AuthServices,
              protected notificationServices: NotificationService,
             ) {

    this.apiServices.currentShop.subscribe(response => {
      this.shop = response;
    });

  }

  ngOnInit(): void {
  }

  CreateMerchant = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loadingBtn = true;
    this.apiServices.CreateMerchant(this.MerchantForm).subscribe(res => {
        this.loadingBtn = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', res.msg);
          this.MerchantForm = {
            full_name: '',
            position_in_company: '',
            email: '',
            phone: '',
            nid_no: '',
            etin_no: '',
            bank_name: '',
            shop_name: '',
            shop_address: '',
            shop_type: '',
            business_email: '',
            business_no_1: '',
            business_no_2: '',
            shop_logo: null,
            business_age: '',
            trade_license_no: '',
            bin_no: '',
            website_link: '',
            instagram_link: '',
            youtube_link: '',
            account_holder_name: '',
            rocket_no: '',
            account_no: '',
            bkash_no: '',
            nagad_no: '',
            shop_banner: null,
            owner_photo: null,
            owner_nid: null,
            guardian_nid: null,
            whatsapp_no: '',
            etin_certificate: null,
            bin_certificate: null,
            current_address: '',
            permanent_address: '',
            facebook_link: '',
            visiting_card: null,
            nid_image: null,
            trade_license:null,
          };
        }else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  }
  ErrorHandaler = (error) => {
    $.each(error, (i, v) => {
      $('[name=' + i + ']').closest('.col-sm-9').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.col-sm-9').find('.invalid-feedback').html(v);
      $('[name=' + i + ']').closest('.col-lg-4').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.col-lg-4').find('.invalid-feedback').html(v);
    });
  }

  AttachFile =  (event, type, index) => {
    const trigger = $(event.target);
    const input = event.target.files[0];
    const formData: any = new FormData();
    formData.append('module_type', 1);
    formData.append('media_type', 1);
    formData.append('image', input);
    formData.append('is_public', true);
    this.loadingType[index] = 1;
    this.imagePreview[index] = null;
    this.apiServices.UploadMedia(formData).subscribe(res => {
      this.loadingType[index] = 0;
      if (res.status === 2000){

        if(type === 1){
          this.MerchantForm.shop_logo = res.data.image_full_path
          console.log( this.MerchantForm.shop_logo)
        }else if (type === 2){
          this.MerchantForm.shop_banner = res.data.image_full_path
          console.log( this.MerchantForm.shop_banner)
        }else if (type === 3){
          this.MerchantForm.visiting_card = res.data.image_full_path
          console.log( this.MerchantForm.visiting_card)
        }else if (type === 4){
          this.MerchantForm.owner_photo = res.data.image_full_path
          console.log( this.MerchantForm.owner_photo)
        }else if (type === 5){
          this.MerchantForm.owner_nid = res.data.image_full_path
          console.log( this.MerchantForm.owner_nid)
        }else if (type === 6){
          this.MerchantForm.guardian_nid = res.data.image_full_path
          console.log( this.MerchantForm.guardian_nid)
        }else if (type === 7){
          this.MerchantForm.trade_license = res.data.image_full_path
          console.log( this.MerchantForm.trade_license)
        }else if (type === 8){
          this.MerchantForm.etin_certificate = res.data.image_full_path
          console.log( this.MerchantForm.etin_certificate)
        }else if (type === 9){
          this.MerchantForm.bin_certificate = res.data.image_full_path
          console.log( this.MerchantForm.bin_certificate)
        }
        this.notificationServices.showInfo('Success', res.msg);
      }
    });

  }

  removeImage = (event, type) => {
    if(type === 1){
      this.MerchantForm.shop_logo = null
    }else if (type === 2){
      this.MerchantForm.shop_banner = null

    }else if (type === 3){
      this.MerchantForm.visiting_card = null

    }else if (type === 4){
      this.MerchantForm.owner_photo = null

    }else if (type === 5){
      this.MerchantForm.owner_nid = null

    }else if (type === 6){
      this.MerchantForm.guardian_nid = null

    }else if (type === 7){
      this.MerchantForm.trade_license = null

    }else if (type === 8){
      this.MerchantForm.etin_certificate = null

    }else if (type === 9){
      this.MerchantForm.bin_certificate = null

    }
  }
}
