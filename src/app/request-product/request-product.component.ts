import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiServices} from '../services/api.services';
import {NotificationService} from "../services/notification.service";

declare let $: any;

@Component({
  selector: 'app-request-product',
  templateUrl: './request-product.component.html',
})
export class RequestProductComponent implements OnInit {
  ENV = environment;
  loading = false;
  loading1 = false;
  loading2 = false;
  requestProductForm: any = {
    product_name:'',
    country:'',
    site_name:'',
    site_link:'',
    product_details:'',
    product_image_1:null,
    product_image_2:null  ,
  }
  preview_image_1: null;
  preview_image_2: null;
  constructor(protected apiService: ApiServices, protected  notificationServices: NotificationService) {

  }
  ngOnInit(): void {}
  requestProducts = () => {
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loading = true;
    this.apiService.RequestProduct(this.requestProductForm).subscribe(res => {
        this.loading = false;
        if (res.status === 2000) {
          this.notificationServices.showInfo('Success', res.msg);
          this.requestProductForm = {
            product_name:'',
            country:'',
            site_name:'',
            site_link:'',
            product_details:'',
            product_image_1:null,
            product_image_2:null  ,
          }
          this.preview_image_1 = null;
          this.preview_image_2 = null;
        }else {
          this.ErrorHandaler(res.error);
        }
      }
    );
  }
  ErrorHandaler = (error) => {
    $.each(error, (i, v) => {
      $('[name=' + i + ']').closest('.col-sm-9').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.form-group').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.col-sm-9').find('.invalid-feedback').html(v);
      $('[name=' + i + ']').closest('.form-group').find('.invalid-feedback').html(v);
      $('[name=' + i + ']').closest('.col-lg-4').find('.form-control').addClass('is-invalid');
      $('[name=' + i + ']').closest('.col-lg-4').find('.invalid-feedback').html(v);
    });
  }

  AttachFile =  (event, type) => {
    const trigger = $(event.target);
    const input = event.target.files[0];
    const formData: any = new FormData();
    formData.append('module_type', 1);
    formData.append('media_type', 1);
    formData.append('image', input);
    formData.append('is_public', true);
    if (type === 0){
      this.loading1 = true;
    }else{
      this.loading2 = true;
    }
    this.apiService.UploadMedia(formData).subscribe(res => {
      if (type === 0){
        this.loading1 = false;
      }else{
        this.loading2 = false;
      }
      if (res.status === 2000){

        if(type === 0){
          this.requestProductForm.product_image_1 = res.data.file_path
          this.preview_image_1 = res.data.image_full_path
        }else{
          this.requestProductForm.product_image_2 = res.data.file_path
          this.preview_image_2 = res.data.image_full_path
        }
        this.notificationServices.showInfo('Success', res.msg);
      }
    });

  }
}

