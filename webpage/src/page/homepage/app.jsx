import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import GLOBAL_VAR from 'common/config/variable'
import {Layout, Menu, Breadcrumb, notification} from 'antd';
import Login from './login';
import Register from './register';
import CreateOrder from './create_order'
import OrderList from './order_list'
import OrderListSelf from './order_list_self';

const {Header, Footer} = Layout;

// 标签：
const TAB_ORDER_LIST = '00' // 订单列表
const TAB_CREATE_ORDER = '01'   // 创建订单
const TAB_MY_ORDER_LIST = '02'   // 我的订单

let DefaultTab = TAB_ORDER_LIST
// 如果初始找不到这个字段，则默认是订单列表
if (!window.localStorage.currentTab) {
    window.localStorage.currentTab = TAB_ORDER_LIST
}

class Root extends React.Component {
    state = {
        username: null,
        usertype: null,
        userid: null,

        tab: window.localStorage.currentTab,

        // 登录窗口是否打开
        loginDialogShow: false,
        // 登录窗口是否打开
        registerDialogShow: false
    };

    componentDidMount () {
        $ajax.had_logined().then(result => {
            if (result.code === 5) {
                this.setState({
                    tab: TAB_ORDER_LIST
                })
                window.localStorage.currentTab = TAB_ORDER_LIST
                return;
            }
            if (result.code === 200) {
                this.setState({
                    username: result.data.username,
                    usertype: result.data.usertype,
                    userid: result.data.userid
                })
            }
        })
    }

    render () {
        let LoginDom = null;
        let RegisterDom = null;
        if (this.state.username === null) {
            LoginDom = <a className={'login-status'}
                          key='login'
                          onClick={() => this.setLoginDialogDisplay(true)}>未登录，点击登录</a>
            RegisterDom = <a className={'reg-status'}
                             key='reg'
                             onClick={() => this.setRegisterDialogDisplay(true)}>注册</a>
        } else {
            RegisterDom = <span className={'reg-status'}
                                key='logout'>
                你好，{this.state.username}！{this.state.usertype ? this.state.usertype === '01' ? `用户类型：发单人` : `用户类型：接单人` : ''}<a
                onClick={this.logout}>点击登出</a>
            </span>
        }

        const user = {
            usertype: this.state.usertype,
            userid: String(this.state.userid)
        }

        return <Layout>
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}
                    id='header'>
                <Menu theme="dark"
                      mode="horizontal"
                      selectedKeys={this.state.tab}
                      onSelect={this.onTabChange}>
                    <Menu.Item key={TAB_ORDER_LIST}>订单列表</Menu.Item>
                    {
                        this.state.usertype === GLOBAL_VAR.USER_TYPE_PUB
                            ? <Menu.Item key={TAB_CREATE_ORDER}>发布订单</Menu.Item>
                            : null
                    }
                    {
                        this.state.usertype !== null
                            ? <Menu.Item key={TAB_MY_ORDER_LIST}>我的订单</Menu.Item>
                            : null
                    }

                    <React.Fragment>
                        {
                            [LoginDom, RegisterDom]
                        }
                    </React.Fragment>
                </Menu>
            </Header>
            {
                this.state.tab === TAB_ORDER_LIST ? <OrderList user={user}/> : null
            }
            {
                this.state.tab === TAB_CREATE_ORDER ? <CreateOrder/> : null
            }
            {
                this.state.tab === TAB_MY_ORDER_LIST ? <OrderListSelf user={user}/> : null
            }
            <Footer style={{textAlign: 'center'}}>开发人：零零水（QQ：20004604，微信：qq20004604）</Footer>

            <Login loginDialogShow={this.state.loginDialogShow}
                   setLoginDialogDisplay={this.setLoginDialogDisplay}
                   setLoginStatus={this.setLoginStatus}/>
            <Register registerDialogShow={this.state.registerDialogShow}
                      setRegisterDialogDisplay={this.setRegisterDialogDisplay}
                      setLoginStatus={this.setLoginStatus}/>
        </Layout>;
    }

    // 打开登录窗口
    setLoginDialogDisplay = (setIsShow) => {
        this.setState({
            loginDialogShow: setIsShow
        })
    }

    // 打开注册窗口
    setRegisterDialogDisplay = (setIsShow) => {
        this.setState({
            registerDialogShow: setIsShow
        })
    }

    // 设置用户当前状态
    setLoginStatus = (data) => {
        this.setState({
            username: data.username,
            usertype: data.usertype,
            userid: data.userid
        })
    }

    // 登出
    logout = () => {
        $ajax.logout().then(result => {
            if (result.code === 200) {
                notification.success({
                    message: '登出成功'
                })
            } else {
                notification.error({
                    message: result.msg
                })
            }
        }).catch(() => {
            notification.error({
                message: '服务器错误'
            })
        }).finally(() => {
            this.setState({username: null, usertype: null, userid: null})
        })
    }

    // 当tab更改时
    onTabChange = (tabObj) => {
        console.log(tabObj)
        const {key} = tabObj;
        window.localStorage.currentTab = key
        this.setState({
            tab: key
        })
    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
