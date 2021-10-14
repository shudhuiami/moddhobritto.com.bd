import {CustomerActiveAccount} from "./store.actions";

export const initState = {
  shops: [],
  GlobalCart: {
    cartList: [],
    total_price: 0,
    total_products: 0,
  },
  SelectedCartProduct: {},
  CustomerActiveAccount: {
    phone: ''
  },
  CustomerActiveAccountCount: 0,
  token: '',
  auth: null
}
