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
    const [tel, setTel] = useState('18258841073');
    const [password, setPW] = useState('12345678');
    const [loading, setLoading] = useState(false);
    const handleOk = () => {
        console.log(tel, password)
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
                setLoginStatus(result.data.username)
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
    return <Modal
        title="登录"
        visible={loginDialogShow}
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
                   rules={[{required: true, message: '请输入手机号码'}]}>
            <Input placeholder="请输入手机号码" value={tel} onChange={e => setTel(e.target.value)}/>
        </Form.Item>
        <Form.Item label="密码">
            <Input.Password placeholder="请输入密码" value={password} onChange={e => setPW(e.target.value)}/>
        </Form.Item>
    </Modal>
}

export default Login
