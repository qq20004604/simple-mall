/**
 * Created by 王冬 on 2020/4/20.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 * 注册
 */
import React from 'react';
import {Modal, Button, Radio, Form, Input, notification} from 'antd';
import $ajax from 'api/ajax.js';

const {useState} = React;

function Register (props) {
    const {
        registerDialogShow,    // 窗口状态变量
        setRegisterDialogDisplay,  // 设置窗口是否显示
        setLoginStatus // 设置登录状态
    } = props;
    const [tel, setTel] = useState('');
    const [username, setUsername] = useState('');
    const [vcode, setVcode] = useState('');
    const [password, setPassword] = useState('');
    const [rpPassword, setRpPassword] = useState('');
    const [usertype, setUsertype] = useState('');
    const [loading, setLoading] = useState(false);

    // 提交注册
    const handleOk = () => {
        console.log({
            tel, username, password, rpPassword, vcode, usertype
        })
        if (password !== rpPassword) {
            notification.error({
                message: '两次密码输入不同'
            })
            return;
        }
        if (!usertype) {
            notification.error({
                message: '请选择用户类型'
            })
            return;
        }

        setLoading(true);
        $ajax.register({
            tel, username, password, vcode, usertype
        }).then(result => {
            // result = {
            //     code: 200,
            //     data: {
            //         username: '测试名'
            //     }
            // }
            if (result.code === 200) {
                notification.success({
                    message: '注册成功'
                })
                setLoginStatus(result.data.username);
                setRegisterDialogDisplay(false);
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
            console.log(result)
            if (result.code === 200) {
                notification.success({
                    message: result.msg
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
                关闭窗口
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                注册
            </Button>
        ]}>
        <Form.Item label="手机"
                   labelCol={{
                       span: 4
                   }}
                   rules={[{required: true, message: '请输入手机号码（11位）'}]}>
            <Input placeholder="请输入手机号码（11位）"
                   maxLength={11}
                   value={tel}
                   onChange={e => setTel(e.target.value)}/>
        </Form.Item>
        <Form.Item label="用户名"
                   labelCol={{
                       span: 4
                   }}
                   maxLength={20}
                   rules={[{required: true, message: '请输入用户名（2~20位）'}]}>
            <Input placeholder="请输入用户名（2~20位）" value={username} onChange={e => setUsername(e.target.value)}/>
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
                    disabled={false}
                    style={{
                        float: 'right'
                    }}
                    onClick={sendVerifyCode}>
                发送验证码
            </Button>
        </Form.Item>
        <Form.Item label="密码"
                   labelCol={{
                       span: 4
                   }}>
            <Input.Password placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)}/>
        </Form.Item>
        <Form.Item label="重复密码"
                   labelCol={{
                       span: 4
                   }}>
            <Input.Password placeholder="请输入密码" value={rpPassword} onChange={e => setRpPassword(e.target.value)}/>
        </Form.Item>
        <Form.Item label="用户类型"
                   labelCol={{
                       span: 4
                   }}>
            <Radio.Group value={usertype}
                         buttonStyle="solid"
                         onChange={e => setUsertype(e.target.value)}>
                <Radio.Button value="">未选择</Radio.Button>
                <Radio.Button value="01">发单人</Radio.Button>
                <Radio.Button value="02">接单人</Radio.Button>
            </Radio.Group>
        </Form.Item>
    </Modal>
}

export default Register
