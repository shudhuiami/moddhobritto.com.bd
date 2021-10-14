import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {environment} from '../../environments/environment';
import {ApiServices} from '../services/api.services';
import {Store} from '@ngrx/store';

declare let $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  ENV = environment;
  bodyParam = {
    tree: true,
    hide_empty_category: 1
  };

  categories = [];
  pages = [];
  slides = [];
  slideLoading = true;
  homeData = [];
  shopSlide = [];
  categoryProduct = [];
  mostSearchData = [];
  brands = [];
  topProduct = [];
  slider = [];
  topRatedProduct = [];
  chankData = [];
  shop_slug = '';
  Auth = null;
  shopDetails: any = {
    address: '',
    cover: '',
    cover_full_path: '',
    cover_vertical: '',
    cover_vertical_full_path: null,
    created_at: '',
    creator_id: '',
    description: '',
    email: '',
    id: '',
    is_active: '',
    location: '',
    logo: '',
    logo_full_path: '',
    parent_id: '',
    phone: '',
    position: '',
    slug: '',
    title: '',
    updated_at: ''
  };
  width = $(window).width();
  loading = true;
  PLoading = false;
  singleLoading = false;
  quantity = 1;
  SingleData: any = {};
  price: 0;
  preview: null;
  variants = {
    variant_id : 0
  };
  EachProduct:[];
  $store: any = null;
  constructor(private store: Store<{store}>,  private router: Router, protected apiService: ApiServices, private route: ActivatedRoute) {
    this.shop_slug = this.route.snapshot.paramMap.get('slug');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shop_slug = this.route.snapshot.paramMap.get('slug');
        this.getHome();
        this.getShopDetails();
        this.getCategories();
      }
    });
  }

  ngOnInit(): void {


  }
  ngAfterViewInit(): void {
    this.$store = this.store.select("store").subscribe((data) => {
      this.Auth = data.auth;
    })
    $('.cart_carousel').owlCarousel({
      loop: true,
      margin: 0,
      // navText: ['<i class=\'las la-arrow-left\'></i>', '<i class=\'las la-arrow-right\'></i>'],
      nav: true,
      items: 1
    });

    $('.verticle-single').owlCarousel({
      items: 1,
      dots: false,
      nav: true,
      rewind: true,
      navText: ['< PREV', 'NEXT >']
    });

    $('.horizontal-slide').owlCarousel({
      items: 1,
      dots: false,
      nav: true,
      rewind: true,
    });

    $('.category-nav').addClass('show');

    $('.special-slider').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      items: 1,
      loop: true,
      nav: true,
      drag: false,
      margin: 0,
      smartSpeed: 450
    });
  }
  ngOnDestroy(){
    this.$store.unsubscribe();
  }
  getShopDetails = () => {
    this.loading = true;
    this.apiService.getShopDetails(this.shop_slug).subscribe(res => {
      this.loading = false;
      if (res.status === 2000) {
        this.shopDetails = res.data;
        setTimeout( () => {
          $('.home-top-slider').owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            items:1,
            loop:true,
            margin:0,
            autoplay:true,
            stagePadding:0,
            smartSpeed:450
          });
        }, 300);
      }
    });
  }
  getCategories = () => {
    if (this.shop_slug != null) {
      this.apiService.getAllCategory(this.shop_slug,  this.bodyParam).subscribe(res => {
        if (res.status === 2000) {
          this.categories = res.data;
        }
      });
    }
  }
  showCategoryModal = () => {
    $('#showMainCategoryModal2').fadeIn()
    $('.category-toggle-button').toggleClass('active')
  }
  hideCategoryModal = () => {
    $('#showMainCategoryModal').fadeOut()
  }
  getHome = () => {
    this.PLoading = true;
    this.apiService.getAllHome(this.shop_slug).subscribe(res => {
      this.PLoading = false;
      if (res.status === 2000) {
        this.brands = res.brands;
        this.categoryProduct = res.category_product;
        $.each(this.categoryProduct, (cat_index, category) => {
          let category_products = category['products'];
          let chunk = 2;
          this.slider.push({
            slideLoader: false
          })
          if(this.width > 1200){
            if(category_products.length > 10){
              chunk = 2
              this.slider[cat_index].slideLoader = true;
              category['slideLoader'] = true
            }else{
              chunk = 10;
              this.slider[cat_index].slideLoader = false;
              category['slideLoader'] = false
            }
          }
          else if(this.width > 800 && this.width < 1200){
            if(category_products.length < 9){
              chunk = 10;
              this.slider[cat_index].slideLoader = false;
              category['slideLoader'] = false
            }else{
              chunk = 2;
              this.slider[cat_index].slideLoader = true;
              category['slideLoader'] = true
            }
          } else if(this.width > 500 && this.width < 800){
            if(category_products.length > 7){
              chunk = 2
              this.slider[cat_index].slideLoader = true;
              category['slideLoader'] = true
            }else{
              chunk = 10;
              this.slider[cat_index].slideLoader = false;
              category['slideLoader'] = false
            }
          } else if(this.width > 0 && this.width < 500){
            if(category_products.length > 5){
              chunk = 2
              this.slider[cat_index].slideLoader = true;
              category['slideLoader'] = true
            }else{
              chunk = 10;
              this.slider[cat_index].slideLoader = false;
              category['slideLoader'] = false
            }
          }

          if(category_products.length > 0){
            let ChunkProducts = category_products.map((e, i) => {return i % chunk === 0 ? category_products.slice(i, i + chunk) : null}).filter(e => {return e});
            category['products'] = ChunkProducts;
          }
        });
        console.log(this.categoryProduct)

        this.EachProduct = res.category_product
        setTimeout(() => {
          $.each(this.categoryProduct, (i, v) => {
            let id = $('#CatProductSlider_'+i);
            id.owlCarousel({
              loop: false,
              margin: 5,
              nav: true,
              autoplay:true,
              navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
              autoplayTimeout:3000,
              autoplayHoverPause:true,
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
                  items: 5
                },
                1400: {
                  items: 5
                }
              }
            });
            $('#PrevSlider_'+i).click(() => {
              id.trigger('prev.owl.carousel')
            })
            $('#NextSlider_'+i).click(() => {
              id.trigger('next.owl.carousel')
            })
          })
          $('.owl-prev').addClass('btn btn-outline-primary')
        }, 1000);
      }
    });
  }

}

