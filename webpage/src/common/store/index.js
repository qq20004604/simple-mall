/**
 * Created by 王冬 on 2019/11/11.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */

import {createStore, combineReducers} from 'redux';

const SVGContainer = function (state = {
    width: 1000,
    height: 800
}, action) {
    if (action.type === 'updateSVGContainer') {
        // 添加svg元素，要求一次性全部添加完。
        // 如果只是单纯新增的话，取Items的全部元素，然后把新的添加到后面，再执行这个
        // 删除是同理的。
        return Object.assign({}, state, action.value)
    } else {
        return state
    }
}

const ItemList = function (state = {
    // 所有SVG元素
    Items: [],
    // 当前焦点的svg元素
    FocusIndex: -1
}, action) {
    if (action.type === 'updateItem') {
        // 添加svg元素，要求一次性全部添加完。
        // 如果只是单纯新增的话，取Items的全部元素，然后把新的添加到后面，再执行这个
        // 删除是同理的。
        return Object.assign({}, state, {
            Items: action.value
        })
    } else if (action.type === 'selectItem') {
        // 选中某个元素，参数传该元素就行
        const item = action.value;
        return Object.assign({}, state, {
            FocusIndex: state.Items.indexOf(item)
        })
    } else {
        return state
    }
}

const reducers = combineReducers({
    ItemList,
    SVGContainer
})
let store = createStore(reducers)
const MapState = function (state) {
    return state
}

export {MapState, store}
