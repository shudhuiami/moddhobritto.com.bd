import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "../layout/layout.component";
import {MainHomeComponent} from '../main-home/main-home.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../auth/login.component';
import {RegisterComponent} from '../auth/register.component';
import {ResetComponent} from '../auth/reset.component';
import {StaticPageComponent} from '../static-page/static-page.component';
import {ProductsComponent} from '../products/products.component';
import {BrandProductsComponent} from '../brand-products/products.component';
import {ProductSingleComponent} from '../product-single/product-single.component';
import {FavoritesComponent} from '../favorites/favorites.component';
import {CheckoutComponent} from '../checkout/checkout.component';
import {payComponent} from '../checkout/pay/pay.component';
import {orderSuccessComponent} from '../checkout/orderSuccess/orderSuccess.component';
import {orderFailComponent} from '../checkout/orderFail/orderFail.component';
import {ProceedComponent} from '../checkout/proceed/proceed.component';
import {orderStatusComponent} from '../order-status/order-status.component';
import {orderDetailComponent} from '../order-status/order-details/order-details.component';
import {comming_soonComponent} from '../comingSoon/comming_soon.component';
import {searchComponent} from '../search/search.component';
import {ProfileComponent} from '../profile/profile.component';
import {PreViewStatusComponent} from '../preview-order-details/preview.component';
import {StaticPageComponentGlobal} from '../static-page/static-page-global.component';
import {SubShopComponent} from '../sub-shop/sub-shop.component';
import {ProfileEditComponent} from '../profile/edit-profile/edit.component';
import {ChangePasswordComponent} from '../profile/change-password/change-password.component';
import {AddressComponent} from '../profile/address/address.component';
import {TransactionComponent} from '../profile/transaction/transaction.component';
import {merchantComponent} from '../merchant/merchant.component';
import {publicProductsComponent} from '../public-categoy-product/public-products.component';
import {PublicSingleComponent} from '../public-single/single.component';
import {contactUsComponent} from '../contact-us/contact-us.component'
import {DealsComponent} from '../deals/deals.component'
import {RequestProductComponent} from '../request-product/request-product.component'
import {categoriesComponent} from '../category/category.component';
import {ActiveComponent} from "../auth/active.component";
import {ForgotComponent} from "../auth/forgot.component";
import {SocialComponent} from '../auth/social.component';
import {AuthGuard} from "../guards/auth.guard";

const routes: Routes = [
  {path: 'coming-soon/:slug', component: comming_soonComponent},
  {
    path: '', component: LayoutComponent,
    children: [
      {path: '', component: MainHomeComponent},

      {path: ':category_slug/category', component: categoriesComponent},

      {path: 'search/:keyword', component: searchComponent},
      {path: 'favorites', component: FavoritesComponent},
      {path: 'deal-of-the-day' , component: DealsComponent},

      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'reset-password', component: ResetComponent},
      {path: 'forgot', component: ForgotComponent},
      {path: 'active', component: ActiveComponent},


      {path: 'request-a-product', component: RequestProductComponent, canActivate: [AuthGuard]},
      {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
      {path: 'order/:order_number/payment', component: payComponent, canActivate: [AuthGuard]},
      {path: 'proceed', component: ProceedComponent, canActivate: [AuthGuard]},
      {path: 'order/:order_id/order-successful', component: orderSuccessComponent, canActivate: [AuthGuard]},
      {path: 'orderFail', component: orderFailComponent, canActivate: [AuthGuard]},
      {path: 'preview', component: PreViewStatusComponent, canActivate: [AuthGuard]},


      {path: 'all_sub_shop/:slug', component: SubShopComponent},

      /*Profile*/
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard]},
      {path: 'profile/orders', component: orderStatusComponent, canActivate: [AuthGuard]},
      {path: 'profile/orders/:order_number/details', component: orderDetailComponent, canActivate: [AuthGuard]},
      {path: 'profile/changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
      {path: 'profile/address', component: AddressComponent, canActivate: [AuthGuard]},
      {path: 'profile/transaction', component: TransactionComponent, canActivate: [AuthGuard]},

      {path: 'merchant/registration', component: merchantComponent, canActivate: [AuthGuard]},
      {path: 'page/:slug', component: StaticPageComponentGlobal},
      {path: ':slug', component: HomeComponent},


      {path: ':slug/products/:category_slug', component: ProductsComponent},
      {path: ':slug/product/:product_slug', component: ProductSingleComponent},

      {path: 'public-product/:category_slug', component: publicProductsComponent},
      {path: 'public-product/:category_slug/public-single-product/:product_slug', component: PublicSingleComponent},


      {path: ':slug/brands/:brand_slug', component: BrandProductsComponent},
      {path: 'support/contact-us', component: contactUsComponent},
      {path: 'social/auth/validate', component: SocialComponent},
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {}
