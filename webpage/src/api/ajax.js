/**
 * Created by 王冬 on 2019/5/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import {get, post} from '../config/http';

const $ajax = {
    login (payload) {
        return post('./login', payload);
    },
    sendVerifyCode (payload) {
        return post('./sendVerifyCode', payload);
    },
    register (payload) {
        return post('./register', payload);
    }
};

export default $ajax;
