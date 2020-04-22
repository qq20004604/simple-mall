/**
 * Created by 王冬 on 2020/4/22.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useState} from 'react';
import {
    PageHeader,
    Form,
    Input,
    Select,
    Button,
    notification
} from 'antd';
import $ajax from 'api/ajax.js';

const {Option} = Select;
const {TextArea} = Input;

// 生成标签
const children = [
    <Option key={'急需'}>急需</Option>
];

function CreateOrder (props) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function handleChange (value) {
        console.log(`selected ${value}`);
        form.setFieldsValue({
            tag: value
        });
    }

    const onFinish = values => {
        console.log('Success:', values);
        const data = Object.assign({}, values);
        data.tag = values.tag ? values.tag.join(',') : '';
        setLoading(true)
        $ajax.orderCreate(data).then(result => {
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
                form.resetFields();
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
            setLoading(false)
        })
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        notification.warning({
            message: '请填写必填项'
        })
    };

    return <div id='CreateOrder'>
        <PageHeader
            className="site-page-header"
            title="创建新订单"/>

        <Form labelCol={{span: 4}}
              wrapperCol={{span: 14}}
              form={form}
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{price: '面议'}}
              size='large'>
            <Form.Item name="title"
                       label='订单名称'
                       validateTrigger={['onSubmit', 'onBlur']}
                       rules={[
                           {
                               required: true,
                               message: '请输入订单名称'
                           },
                           {
                               validator (rule, value) {
                                   console.log(rule, value)
                                   if (!value) {
                                       return Promise.resolve();
                                   }
                                   if (value.length < 4 || value.length > 40) {
                                       return Promise.reject(`【订单名称】长度应该在4~40字之间，当前 ${!value ? 0 : value.length} 字`);
                                   }
                                   return Promise.resolve();
                               }
                           }
                       ]}>
                <Input maxLength={40}
                       placeholder="请输入订单名称，长度应该在4~40字之间"/>
            </Form.Item>
            <Form.Item name='content'
                       label="订单内容"
                       rules={[
                           {
                               required: true,
                               message: '请输入订单内容'
                           }
                       ]}>
                <TextArea maxLength={2000}
                          style={{
                              fontSize: '16px'
                          }}
                          size='large'
                          placeholder="请输入订单内容，字数不超过2000字"
                          rows={12}/>
            </Form.Item>
            <Form.Item name='tag'
                       label="标签"
                       rules={[
                           {
                               validator (rule, value) {
                                   console.log(rule, value)
                                   if (!value) {
                                       return Promise.resolve();
                                   }
                                   if (value.length > 5) {
                                       return Promise.reject(`【标签】最多只能有5个，当前 ${value.length} 个`);
                                   }
                                   const tooLongTag = value.filter(item => {
                                       return item.length > 8
                                   })
                                   if (tooLongTag.length > 0) {
                                       const tooLongText = tooLongTag.map(tag => {
                                           return `【${tag}】`
                                       }).join('，')
                                       return Promise.reject(`【标签】长度最多为8个字，以下标签字数超标了${tooLongText}`);
                                   }
                                   return Promise.resolve();
                               }
                           }
                       ]}>
                <Select mode="tags"
                        style={{width: '100%'}}
                        allowClear={true}
                        placeholder="请输入或选择标签，单个标签长度不超过8个字，标签数量最多5个"
                        onChange={handleChange}>
                    {children}
                </Select>
            </Form.Item>
            <Form.Item name="price"
                       label='订单预期价格'
                       validateTrigger={['onSubmit', 'onBlur']}
                       placeholder="请输入订单预期价格，字数不超过20字"
                       rules={[
                           {
                               required: true,
                               message: '请输入订单预期价格，字数不超过20字'
                           },
                           {
                               validator (rule, value) {
                                   console.log(rule, value)
                                   if (!value) {
                                       return Promise.resolve();
                                   }
                                   if (value.length > 20) {
                                       return Promise.reject(`【订单预期价格】长度应该小于20字，当前 ${!value ? 0 : value.length} 字`);
                                   }
                                   return Promise.resolve();
                               }
                           }
                       ]}>
                <Input maxLength={20}/>
            </Form.Item>
            <Form.Item wrapperCol={{span: 14, offset: 4}}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>

    </div>
}

export default CreateOrder
