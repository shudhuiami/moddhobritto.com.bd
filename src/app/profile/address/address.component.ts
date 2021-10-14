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
  selector: 'app-address',
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {
  ENV = environment;

  loading = false;


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
  division = []
  district = []
  area = []
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

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, protected apiServices: ApiServices, protected authServices: AuthServices, protected notificationServices: NotificationService) {
    this.getAllAddress();
  }

  ngOnInit(): void {
    $(function() {
      $('.orderDetails').click(function() {
        // remove classes from all
        $('.orderDetails').removeClass('active');
        // add class to the one we clicked
        $(this).addClass('active');
      });
    });

  }



//  Close Add Address Modal
  closeAddAddressModal = () => {
    $('#addAddress').fadeOut(200);
  };
//  Open Add Address Modal
  CreateAddressModal = () => {
    this.division = []
    this.district = []
    this.area = []
    this.getAllDivisions();
    $('.create-form').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.AddAddress = {
      title: '',
      name: '',
      phone: '',
      street: '',
      city: '',
      zip: '',
      division: '',
      district: '',
      area: ''
    };
    $('#addAddress').fadeIn(200);

  };
  //  Close edit Address Modal
  closeEditAddressModal = () => {
    $('#editAddress').fadeOut(200);
  };
//  Open Add Address Modal
  editAddress = (index) => {
    this.division = []
    this.district = []
    this.area = []
    let editdata = this.address[index];

    this.editForm = editdata;
    this.loading = true;
    $('#editAddress').fadeIn(200);
    this.apiServices.getDivision('').subscribe(res =>{

      if(res.status === 2000){
        this.division = res.data
        if(this.editForm.division != null){
          let division_id = {
            division_id: this.editForm.division,
          }
          this.apiServices.getDistrict(division_id).subscribe(res => {
            if(res.status === 2000){
              this.district = res.data

              if(this.editForm.district != null){
                let district_id = {
                  district_id : this.editForm.district,
                }
                this.apiServices.getArea(district_id).subscribe(res => {
                  if(res.status === 2000){
                    this.area = res.data
                    this.loading = false;

                  }
                })
              }
            }
          })
        }
      }

    })
  };

//  Edit Address
  edit = () => {
    this.loading = true;
    this.apiServices.editAddress(this.editForm).subscribe(res => {
      if (res.status === 2000) {
        this.loading = false;
        this.notificationServices.showInfo('Success', 'Update Successful');
        this.closeEditAddressModal();
        this.getAllAddress();
      } else {
        this.ErrorHandaler2(res.error);
        this.loading = false;
      }
    });
  };


//  Address Delete Confirmation Modal
  DeleteConfirmationAddress = (index) => {
    let deleteId = this.address[index];
    this.deleteFrom.id = deleteId.id;
    $('#DeleteAddress').fadeIn(200);
  };
  closeDeleteConfirmation = () => {
    $('#DeleteAddress').fadeOut(200);
  };

//  Delete Address
  delete = () => {
    this.apiServices.deleteAddress(this.deleteFrom).subscribe(res => {
      if (res.status === 2000) {
        this.notificationServices.showInfo('Success', 'Address Deleted');
        this.closeDeleteConfirmation();
        this.getAllAddress();
      }
    });
  };


//  Confirmation Cancel order Modal
  openConfirmationModal = () => {
    $('.confirmation').fadeIn(200);
  };
//  Close Confirmation Cancel Order Modal
  closeConfirmationModal = () => {
    $('.confirmation').fadeOut(200);
  };







  // Get Address
  getAllAddress = () => {
    this.apiServices.getAddress(this.param).subscribe(res => {
      if (res.status === 2000) {
        this.address = res.data.data;
        this.laravelData = res.data;
      }
    });
  };

  changePage(pagination): void {
    this.param.page = pagination.page;
    this.getAllAddress();
  }


  /*
  * Get Division
  * */
  getAllDivisions = () =>{
    this.apiServices.getDivision('').subscribe(res =>{
      if(res.status === 2000){
        this.division = res.data
      }
    })
  }


  /*
  * Get District
  * */
  getAllDistrict = () =>{
    let division_id = {
      division_id: this.AddAddress.division,
    }
    this.apiServices.getDistrict(division_id).subscribe(res => {
      if(res.status === 2000){
        this.district = res.data
      }
    })

  }
  getAllDistrictEdit = () =>{
    let division_id = {
      division_id: this.editForm.division,
    }
    this.apiServices.getDistrict(division_id).subscribe(res => {
      if(res.status === 2000){
        this.district = res.data
      }
    })

  }
  // ChooseDistrict = () => {
  //   if(this.AddAddress.district != ''){
  //     this.getAllArea(this.AddAddress.district)
  //   }
  // }

  /*
* Get Area
* */
  getAllArea = () =>{
    let district_id = {
      district_id : this.AddAddress.district,
    }
    this.apiServices.getArea(district_id).subscribe(res => {
      if(res.status === 2000){
        this.area = res.data
      }
    })
  }
  getAllAreaEdit = () =>{
    let district_id = {
      district_id : this.editForm.district,
    }
    this.apiServices.getArea(district_id).subscribe(res => {
      if(res.status === 2000){
        this.area = res.data
      }
    })
  }



// Add Address

  createdAddress = () => {
    $('.create-form').removeClass('is-invalid');
    $('.invalid-feedback').html('');
    this.loading = true;
    this.apiServices.createAddress(this.AddAddress).subscribe(res => {
      if (res.status === 2000) {
        this.notificationServices.showInfo('Success', 'Address Created');
        this.getAllAddress();
        this.closeAddAddressModal();
        this.loading = false;
      } else {
        this.ErrorHandaler2(res.error);
        this.loading = false;
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
