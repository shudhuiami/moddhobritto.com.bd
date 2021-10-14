import {Component, OnInit, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {Router, NavigationEnd} from '@angular/router';
import {ApiServices} from '../services/api.services';
import {HelperServices} from '../services/helper.service';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app--main-home',
  templateUrl: './main-home.component.html',
})
export class MainHomeComponent implements OnInit, OnDestroy {
  ENV = environment;
  shops = [];
  slidesItems = [];
  dealData = [];
  partners = [];
  featuredShop = [];
  CategoryList = null;
  PublicCategory = [];
  $store: any = null;
  pages = [];
  sliderLoading = false;
  constructor(private router: Router, protected apiService: ApiServices, protected helperService: HelperServices) {}

  ngOnInit(): void {

    this.getSliderHeader();
    this.getPartners();
    this.getPublicCategory();
    this.getDeal();
    this.getFeaturedShop();

    $('body').scroll(() => {
      $('shops-list-wrapper').children().hash;
    })

  }

  ngOnDestroy() {

  }
  cateScroll(){
    $('.more-category').toggleClass('active')
  }
  getSliderHeader = () => {
    this.sliderLoading = true;
    this.apiService.getHeaderSlider().subscribe(response => {
      this.sliderLoading = false;
      if (response.status === 2000) {
        this.slidesItems = response.data;
        setTimeout(() => {
          $('.main-home-slider').owlCarousel({
            items: 1,
            loop: false,
            nav:true,
            rewind:true,
            lazyLoad:true,
            dotsEach:true,
            margin: 0,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: false
          });
        }, 300)
      }
    });
  }
  getPublicCategory = () => {
    this.apiService.publicCategory().subscribe(response => {
      if (response.status === 2000) {
        this.PublicCategory = response.data;
      }
    });
  }
  showCategoryModal = (shop) => {
    this.CategoryList = shop;
   $('#showMainCategoryModal').fadeIn()
   $('.category-modal-button').toggleClass('active')
  }
  hideCategoryModal = () => {
   $('#showMainCategoryModal').fadeOut()
  }
  getPartners = () => {
    this.apiService.getPartners(null).subscribe(res => {
      if (res.status === 2000) {
        this.partners = res.data;
        setTimeout(() => {
          $('#partners-slide').owlCarousel({
            loop: false,
            rewind: true,
            margin: 15,
            nav: false,
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: 3
              },
              1000: {
                items: 8
              }
            }
          });
        }, 300);
      }
    })
  }
  getFeaturedShop = () => {
    this.apiService.getFeaturedShop(null).subscribe(res => {
      if (res.status === 2000) {
        this.featuredShop = res.data;
      }
    })
  }
  scrollDown = () => {
    let vheight = $(window).height();
    $('html, body').animate({
      scrollTop: (Math.floor(($(window).scrollTop() / vheight) + 1) * vheight)
    }, 500)

  }
  getDeal = () => {
    this.apiService.getDeals('').subscribe(response => {
      if (response.status === 2000) {
        this.dealData = response.data.data;
        setTimeout(() => {

          let id = $('#Deals-slider');
          id.owlCarousel({
            loop: false,
            rewind: true,
            margin: 5,
            nav: true,
            dots: false,
            autoplay: true,
            // navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
              0: {
                items: 2
              },
              400: {
                items: 2
              },
              500: {
                items: 3
              },
              650: {
                items:3
              },
              800: {
                items: 4
              },
              1000: {
                items: 4
              },
              1200: {
                items: 6
              },
              1400: {
                items: 6
              }
            }
          });
          $('#PrevSlider').click(() => {
            id.trigger('prev.owl.carousel')
          })
          $('#NextSlider').click(() => {
            id.trigger('next.owl.carousel')
          })
        }, 500);
      }
    });
  }
  scrollToShop = (index) => {
    let count = 0;
    for (let i = 0; i < 6; i++) {
      let element = $("#ShopSectionEach_" + i).visible(true)

      if (element == true) {
        if(i < 5){
          $('html, body').animate({
            scrollTop: $("#ShopSectionEach_"+ (i+1)).offset().top
          }, 800);
        }else{
          $('html, body').animate({
            scrollTop: $("#ShopSectionEach_0").offset().top
          }, 800);
        }
      }else{
        count = count + 1;
      }
    }
    if(count == 6){
      $('html, body').animate({
        scrollTop: $("#ShopSectionEach_0").offset().top
      }, 800);
    }
  }
}
