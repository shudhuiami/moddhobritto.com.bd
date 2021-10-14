import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { NgwWowModule } from 'ngx-wow';
import {Ng2FittextModule} from "ng2-fittext";

import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {ShopLayoutComponent} from './layout/shop-layout.component';
import {HeaderComponent} from './layout/shared/header.component';
import {FooterComponent} from './layout/shared/footer.component';
import {MainHomeComponent} from './main-home/main-home.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login.component';
import {ActiveComponent} from './auth/active.component';
import {RegisterComponent} from './auth/register.component';
import {ResetComponent} from './auth/reset.component';
import {StaticPageComponent} from './static-page/static-page.component';
import {TremsComponent} from './static-page/trems.component';
import {FaqComponent} from './static-page/faq.component';
import {ProductsComponent} from './products/products.component';
import {BrandProductsComponent} from './brand-products/products.component';
import {ProductSingleComponent} from './product-single/product-single.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {payComponent} from './checkout/pay/pay.component';
import {orderSuccessComponent} from './checkout/orderSuccess/orderSuccess.component';
import {orderFailComponent} from './checkout/orderFail/orderFail.component';
import {ProceedComponent} from './checkout/proceed/proceed.component';
import {orderStatusComponent} from './order-status/order-status.component';
import {orderDetailComponent} from './order-status/order-details/order-details.component';
import {comming_soonComponent} from './comingSoon/comming_soon.component';
import {searchComponent} from './search/search.component';
import {ProfileComponent} from './profile/profile.component';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {NgLaravelPaginationModule} from 'ng-laravel-pagination';
import {PreViewStatusComponent} from './preview-order-details/preview.component';
import {StaticPageComponentGlobal} from './static-page/static-page-global.component';
import {SubShopComponent} from './sub-shop/sub-shop.component';
import {ProfileEditComponent} from './profile/edit-profile/edit.component';
import {ChangePasswordComponent} from './profile/change-password/change-password.component';
import {TransactionComponent} from './profile/transaction/transaction.component';
import {AddressComponent} from './profile/address/address.component';
import {merchantComponent} from './merchant/merchant.component';
import {publicProductsComponent} from './public-categoy-product/public-products.component';
import {ProfileLinksComponent} from './profile/profile-links.component';
import {productBoxComponent} from './product-box/product-box.component';
import {storeReducer} from './state/store.reducers';
import {PublicSingleComponent} from './public-single/single.component';
import {contactUsComponent} from './contact-us/contact-us.component'
import {DealsComponent} from './deals/deals.component';
import {ForgotComponent} from './auth/forgot.component';

import {RequestProductComponent} from './request-product/request-product.component'

import {topProductsComponent} from './widget/TopProducts/topProducts.component';
import {topSellersComponent} from './widget/TopSellers/topSellers.component';
import {topTagsComponent} from './widget/TopTags/topTags.component';
import {BrandWidgetComponent} from './widget/brand/brands.component';
import {SubShopWidgetComponent} from './widget/sub-shop/sub-shop-widget.component';


import {categoriesComponent} from './category/category.component';

import { RoutingModule } from './routes/routing.module';
import { SocialComponent } from './auth/social.component';
import {AuthGuard} from "./guards/auth.guard";

@NgModule({
  declarations: [
    AppComponent, LayoutComponent, ShopLayoutComponent, HeaderComponent, FooterComponent, MainHomeComponent, HomeComponent,
    LoginComponent, RegisterComponent, ResetComponent, ActiveComponent,
    StaticPageComponent, TremsComponent, FaqComponent, contactUsComponent, categoriesComponent,
    BrandProductsComponent,  productBoxComponent,PublicSingleComponent, RequestProductComponent,
    ProfileComponent, ProductsComponent, ProductSingleComponent, FavoritesComponent,DealsComponent,
    CheckoutComponent, orderSuccessComponent, orderFailComponent, searchComponent, comming_soonComponent,orderDetailComponent,
    orderStatusComponent, PreViewStatusComponent, ProceedComponent, payComponent, StaticPageComponentGlobal, SubShopComponent,
    topProductsComponent, topSellersComponent, topTagsComponent, BrandWidgetComponent, SubShopWidgetComponent,
    ProfileEditComponent, ChangePasswordComponent, AddressComponent, merchantComponent  , publicProductsComponent, ProfileLinksComponent, TransactionComponent, ForgotComponent,
    SocialComponent

  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    FormsModule,
    Ng2FittextModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSliderModule,
    NgwWowModule,
    StoreModule.forRoot({store: storeReducer}),
    NgLaravelPaginationModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],


})
export class AppModule {

}

