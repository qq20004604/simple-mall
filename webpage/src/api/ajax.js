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
    register (payload) {
        return post('/register/', payload);
    },
    login (payload) {
        return post('/login/', payload);
    },
    had_logined () {
        return post('/login/had_logined/');
    },
    logout () {
        return post('/login/logout/');
    }
};

export default $ajax;
