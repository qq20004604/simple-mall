import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import {Layout, Menu, Breadcrumb, notification} from 'antd';
import Login from './login';
import Register from './register';
import CreateOrder from './create_order'
import OrderList from './order_list'

const {Header, Content, Footer} = Layout;

const USER_TYPE_PUB = '01'
// 标签：
const TAB_ORDER_LIST = '00' // 订单列表
const TAB_CREATE_ORDER = '01'   // 创建订单

class Root extends React.Component {
    state = {
        username: null,
        usertype: null,

        tab: TAB_ORDER_LIST,

        // 登录窗口是否打开
        loginDialogShow: false,
        // 登录窗口是否打开
        registerDialogShow: false
    };

    componentDidMount () {
        $ajax.had_logined().then(result => {
            if (result.code === 200) {
                this.setState({
                    username: result.data.username,
                    usertype: result.data.usertype
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
                你好，{this.state.username}！<a onClick={this.logout}>点击登出</a>
            </span>
        }

        return <Layout>
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}
                    id='header'>
                <Menu theme="dark"
                      mode="horizontal"
                      defaultSelectedKeys={TAB_ORDER_LIST}
                      onSelect={this.onTabChange}>
                    <Menu.Item key={TAB_ORDER_LIST}>订单列表</Menu.Item>
                    {
                        this.state.usertype === USER_TYPE_PUB
                            ? <Menu.Item key={TAB_CREATE_ORDER}>发布订单</Menu.Item>
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
                this.state.tab === TAB_ORDER_LIST ? <OrderList usertype={this.state.usertype}/> : null
            }
            {
                this.state.tab === TAB_CREATE_ORDER ? <CreateOrder usertype={this.state.usertype}/> : null
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
        this.setState({username: data.username, usertype: data.usertype})
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
            this.setState({username: null, usertype: null})
        })
    }

    // 当tab更改时
    onTabChange = (tabObj) => {
        console.log(tabObj)
        const {key} = tabObj;
        this.setState({
            tab: key
        })
    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
