/**
 * Created by 王冬 on 2019/5/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import {get, post} from '../config/http';

const $ajax = {
    sendVerifyCode (payload) {
        return post('/register/sendVerifyCode/', payload);
    },
    sendResetPWVerifyCode (payload) {
        return post('resetpw/sendVerifyCode/', payload);
    },
    register (payload) {
        return post('/register/', payload);
    },
    resetPW (payload) {
        return post('/resetpw/reset/', payload);
    },
    login (payload) {
        return post('/login/', payload);
    },
    had_logined () {
        return post('/login/had_logined/');
    },
    logout () {
        return post('/login/logout/');
    },
    orderCreate (payload) {
        return post('/orders/create/', payload);
    },
    orderList (payload) {
        return post('/orders/list/all/', payload);
    },
    orderDetailPublic (payload) {
        return post('/orders/detail/public/', payload);
    },
    orderListSelf (payload) {
        return post('/orders/list/self/', payload);
    },
    orderDetailPrivate (payload) {
        return post('/orders/detail/private/', payload);
    },
    takeOrder (payload) {
        return post('/orders/order/take/', payload);
    },
    setOrderTaker (payload) {
        return post('/orders/order/set_taker_order/', payload);
    },
    beginOrder (payload) {
        return post('/orders/order/begin/', payload);
    },
    endOrder (payload) {
        return post('/orders/order/end/', payload);
    },
    rate (payload) {
        return post('/orders/order/rate/', payload);
    }
};

export default $ajax;
