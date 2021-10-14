import {createReducer, on} from '@ngrx/store';
import {initState} from './store.state';
import {getGlobalShops, GlobalCartModal, GlobalCartClear, GlobalCartStore, CustomerAuthStore, CustomerActiveAccount} from './store.actions';

const _storeFunction = createReducer(
  initState,
  on(getGlobalShops, (state, action) => {
    return {
      ...state,
      shops: action.data
    };
  }),
  on(GlobalCartStore, (state, action) => {
    return {
      ...state,
      GlobalCart: action.data
    };
  }),
  on(GlobalCartModal, (state, action) => {
    return {
      ...state,
      SelectedCartProduct: action.data
    };
  }),
  on(GlobalCartClear, (state, action) => {
    return {
      ...state,
      SelectedCartProduct: {}
    };
  }),
  on(CustomerAuthStore, (state, action) => {
    return {
      ...state,
      token: action.data.token,
      auth: action.data.user
    };
  }),
  on(CustomerActiveAccount, (state, action) => {
    return {
      ...state,
      CustomerActiveAccount: action.data.user,
      CustomerActiveAccountCount: action.data.ActivationCount,
    };
  })
);

export function storeReducer(state, action) {
  return _storeFunction(state, action);
}
