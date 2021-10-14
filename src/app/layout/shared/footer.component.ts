import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelperServices} from '../../services/helper.service';
import {ApiServices} from '../../services/api.services';
import {NotificationService} from '../../services/notification.service';

declare let $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit{
  webData = null;
  mostSearchData = null;
  loadingbtn = false;
  param = {
    email: ''
  };
  mostParam: any = {
    limit: 10
  };
  partners = [];
  pages = [];


  constructor(private router: Router, protected helperServices: HelperServices, protected apiServices: ApiServices, protected notificationServices: NotificationService) {
    setTimeout(()=> {
      this.helperServices.currentWebsiteSettings.subscribe(response => {
        if (response !== null) {
          this.webData = response;
        }
      });
    },300)

    this.apiServices.CurrentPages.subscribe(response => {
      this.pages = response;
    });

    /**
     * get Most Search Data
     *
     */


  }

  ngOnInit(): void{

  }


  /**
   * get Web Settings Data
   *
   */

  getYear(): any {
    const t = new Date();
    return t.getFullYear();
  }


  /**
   * News Letter
   *
   */

  newsLetters = () => {
    this.loadingbtn = true;
    this.apiServices.newsLetter(this.param).subscribe( res => {
      this.loadingbtn = false;
      if(res.status === 2000){
        this.notificationServices.showInfo('Success', 'Subscribe Successful')
        this.param.email = ''
      }
    })
  }

  /**
   * Get Most Search
   *
   **/
  getPartners = () => {
    this.apiServices.getPartners(null).subscribe(res => {
      if(res.status === 2000){
        this.partners = res.data;
        setTimeout( () => {
          $('.brand-slider').owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: 3
              },
              1000: {
                items: 5
              }
            }
          });
        }, 5000);
      }
    })
  }
}
