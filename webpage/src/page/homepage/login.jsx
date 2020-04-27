/**
 * Created by 王冬 on 2020/4/20.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 * 登录
 */
import React from 'react';
import {Modal, Button, Form, Input, notification} from 'antd';
import $ajax from 'api/ajax.js';

const {useState} = React;

function Login (props) {
    const {
        loginDialogShow,    // 窗口状态变量
        setLoginDialogDisplay,  // 设置窗口是否显示
        setLoginStatus // 设置登录状态
    } = props;
    const [tel, setTel] = useState('');
    const [password, setPW] = useState('');
    const [rppassword, setRPPW] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('login');
    const [vcode, setVcode] = useState('');
    const [isSendBtnDisabled, setSendBtnDisabled] = useState(false);
    const login = () => {
        if (!tel) {
            return notification.error({
                message: '请填写手机号码'
            })
        }
        if (!password) {
            return notification.error({
                message: '请填写密码'
            })
        }

        setLoading(true);
        $ajax.login({
            tel, password
        }).then(result => {
            // result = {
            //     code: 200,
            //     data: {
            //         username: '测试名'
            //     }
            // }
            if (result.code === 200) {
                notification.success({
                    message: '登录成功'
                })
                setLoginStatus(result.data);
                setLoginDialogDisplay(false);
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
            setLoading(false);
        })
    }
    const handleCancel = () => {
        setLoginDialogDisplay(false);
    }
    const resetPW = () => {
        if (!tel) {
            return notification.error({
                message: '请填写手机号码'
            })
        }
        if (!vcode) {
            return notification.error({
                message: '请填写验证码'
            })
        }
        if (!password) {
            return notification.error({
                message: '请填写密码'
            })
        }
        if (password !== rppassword) {
            return notification.error({
                message: '两次密码输入不一致'
            })
        }

        setLoading(true);
        $ajax.resetPW({
            tel,
            password: password,
            verifyCode: vcode
        }).then(result => {
            // result = {
            //     code: 200,
            //     data: {
            //         username: '测试名'
            //     }
            // }
            if (result.code === 200) {
                notification.success({
                    message: '登录成功'
                })
                setLoginStatus(result.data);
                setLoginDialogDisplay(false);
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
            setLoading(false);
        })
    }

    // 发送验证码
    const sendResetPWVerifyCode = () => {
        if (tel.length !== 11) {
            notification.error({
                message: '未输入手机号码 或 手机号码不是11位'
            })
            return;
        }

        $ajax.sendResetPWVerifyCode({
            tel
        }).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                notification.success({
                    message: result.msg
                })
                setSendBtnDisabled(true)
            } else {
                notification.error({
                    message: result.msg
                })
            }
        }).catch(() => {
            notification.error({
                message: '服务器错误'
            })
        })
    }

    const loginFooter = [
        <Button key="reset" type="dashed" style={{float: 'left'}} onClick={() => setType('reset')}>
            找回密码
        </Button>,
        <Button key="back" onClick={handleCancel}>
            关闭
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={login}>
            登录
        </Button>
    ]

    const resetPWFooter = [
        <Button key="reset" type="dashed" style={{float: 'left'}} onClick={() => setType('login')}>
            登录
        </Button>,
        <Button key="back" onClick={handleCancel}>
            关闭
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={resetPW}>
            重设密码
        </Button>
    ]

    return <Modal
        title="登录"
        visible={loginDialogShow}
        onCancel={handleCancel}
        footer={type === 'login' ? loginFooter : resetPWFooter}>
        {
            type === 'login' ? <Form>
                <Form.Item label="手机"
                           labelCol={{
                               span: 4
                           }}
                           rules={[{required: true, message: '请输入手机号码'}]}>
                    <Input placeholder="请输入手机号码" value={tel} onChange={e => setTel(e.target.value)}/>
                </Form.Item>
                <Form.Item label="密码"
                           labelCol={{
                               span: 4
                           }}>
                    <Input.Password placeholder="请输入密码"
                                    value={password}
                                    onChange={e => setPW(e.target.value)}
                                    onKeyUp={e => {
                                        if (e.keyCode === 13) {
                                            login()
                                        }
                                    }}/>
                </Form.Item>
            </Form> : <Form>
                <Form.Item label="手机"
                           labelCol={{
                               span: 4
                           }}
                           rules={[{required: true, message: '请输入手机号码'}]}>
                    <Input placeholder="请输入手机号码" value={tel} onChange={e => setTel(e.target.value)}/>
                </Form.Item>
                <Form.Item label="验证码"
                           labelCol={{
                               span: 4
                           }}
                           maxLength={4}
                           rules={[{required: true, message: '请输入验证码'}]}>
                    <Input placeholder="请输入验证码"
                           disabled={false}
                           style={{
                               width: 250
                           }} value={vcode} onChange={e => setVcode(e.target.value)}/>
                    <Button type='primary'
                            disabled={isSendBtnDisabled}
                            style={{
                                float: 'right'
                            }}
                            onClick={sendResetPWVerifyCode}>
                        {isSendBtnDisabled ? '已发送' : '发送验证码'}
                    </Button>
                </Form.Item>
                <Form.Item label="密码"
                           labelCol={{
                               span: 4
                           }}>
                    <Input.Password placeholder="请输入密码"
                                    value={password}
                                    onChange={e => setPW(e.target.value)}/>
                </Form.Item>
                <Form.Item label="重复密码"
                           labelCol={{
                               span: 4
                           }}>
                    <Input.Password placeholder="请再次输入密码"
                                    value={rppassword}
                                    onChange={e => setRPPW(e.target.value)}
                                    onKeyUp={e => {
                                        if (e.keyCode === 13) {
                                            handleOk()
                                        }
                                    }}/>
                </Form.Item>
            </Form>
        }

    </Modal>
}

export default Login
