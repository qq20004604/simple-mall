/**
 * Created by 王冬 on 2020/4/20.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 * 注册
 */
import React from 'react';
import {Modal, Button, Form, Input, notification} from 'antd';
import $ajax from 'api/ajax.js';

const {useState} = React;

function Register(props) {
    const {
        registerDialogShow,    // 窗口状态变量
        setRegisterDialogDisplay,  // 设置窗口是否显示
        setLoginStatus // 设置登录状态
    } = props;
    const [tel, setTel] = useState('');
    const [username, setUsername] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [pw, setPW] = useState('');
    const [rppw, setRpPW] = useState('');
    const [loading, setLoading] = useState(false);
    // 提交注册
    const handleOk = () => {
        console.log(tel, pw)
        setLoading(true);
        if (pw !== rppw) {
            notification.error({
                message: '两次密码输入不同'
            })
            return;
        }

        $ajax.register({
            tel, pw
        }).then(result => {
            // result = {
            //     code: 200,
            //     data: {
            //         username: '测试名'
            //     }
            // }
            if (result.code === 200) {
                // setLoginStatus(result.data.username)
            }
        }).catch(() => {
            notification.error({
                message: '服务器错误'
            })
        }).finally(() => {
            setLoading(false);
        })
    }
    // 关闭窗口
    const handleCancel = () => {
        setRegisterDialogDisplay(false);
    }
    // 发送验证码
    const sendVerifyCode = () => {
        if (tel.length !== 11) {
            notification.error({
                message: '未输入手机号码 或 手机号码不是11位'
            })
            return;
        }

        $ajax.sendVerifyCode({
            tel
        }).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            if (result.code === 200) {
                notification.info({
                    message: '验证码已发送'
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
        })
    }

    return <Modal
        title="注册"
        visible={registerDialogShow}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
            <Button key="back" onClick={handleCancel}>
                关闭
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                登录
            </Button>
        ]}>
        <Form.Item label="手机"
                   labelCol={{
                       span: 3
                   }}
                   rules={[{required: true, message: '请输入手机号码（11位）'}]}>
            <Input placeholder="请输入手机号码（11位）"
                   maxLength={11}
                   value={tel}
                   onChange={e => setTel(e.target.value)}/>
        </Form.Item>
        <Form.Item label="用户名"
                   labelCol={{
                       span: 3
                   }}
                   maxLength={20}
                   rules={[{required: true, message: '请输入用户名（2~20位）'}]}>
            <Input placeholder="请输入用户名（2~20位）" value={username} onChange={e => setUsername(e.target.value)}/>
        </Form.Item>
        <Form.Item label="验证码"
                   labelCol={{
                       span: 3
                   }}
                   maxLength={4}
                   rules={[{required: true, message: '请输入验证码'}]}>
            <Input placeholder="应有验证码功能，因为是DEMO故禁用"
                   disabled={true}
                   style={{
                       width: 300
                   }} value={verifyCode} onChange={e => setVerifyCode(e.target.value)}/>
            <Button type='primary'
                    disabled={true}
                    style={{
                        float: 'right'
                    }}
                    onClick={sendVerifyCode}>
                发送验证码
            </Button>
        </Form.Item>
        <Form.Item label="密码"
                   labelCol={{
                       span: 3
                   }}>
            <Input.Password placeholder="请输入密码" value={pw} onChange={e => setPW(e.target.value)}/>
        </Form.Item>
        <Form.Item label="重复密码"
                   labelCol={{
                       span: 3
                   }}>
            <Input.Password placeholder="请输入密码" value={rppw} onChange={e => setRpPW(e.target.value)}/>
        </Form.Item>
    </Modal>
}

export default Register
