import {createAction, props} from '@ngrx/store';

export const getGlobalShops = createAction("getGlobalShops", props<{data: any}>());
export const GlobalCartModal = createAction("GlobalCartModal", props<{data: any}>());
export const GlobalCartClear = createAction("GlobalCartClear");
export const GlobalCartStore = createAction("GlobalCartStore", props<{data: any}>());
export const CustomerAuthStore = createAction("CustomerAuthStore", props<{data: any}>());
export const CustomerActiveAccount = createAction("CustomerActiveAccount", props<{data: any}>());
