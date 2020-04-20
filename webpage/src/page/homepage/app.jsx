import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import {Layout, Menu, Breadcrumb} from 'antd';
import Login from './login';
import Register from './register';

const {Header, Content, Footer} = Layout;

class Root extends React.Component {
    state = {
        username: null,

        // 登录窗口是否打开
        loginDialogShow: false,
        // 登录窗口是否打开
        registerDialogShow: true
    };

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
            RegisterDom = <a className={'reg-status'}
                             key='logout'>
                你好，{this.state.username}！<a onClick={this.logout}>点击登出</a>
            </a>
        }

        return <Layout>
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}
                    id='header'>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">订单列表</Menu.Item>
                    <React.Fragment>
                        {
                            [LoginDom, RegisterDom]
                        }
                    </React.Fragment>
                </Menu>
            </Header>
            <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
                    Content
                </div>
            </Content>
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
    setLoginStatus = () => {

    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
