/**
 * Created by 王冬 on 2020/4/26.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useState} from 'react';
import {Modal, Button, Rate, Form, Input, notification} from 'antd';
import $ajax from 'api/ajax.js';

const {TextArea} = Input

const desc = ['1分（差评）', '2分', '3分（普通）', '4分', '5分（好评）'];

function RateComponent (props) {
    const {orderId, loadDetail} = props;
    const [dialogVisible, setDialogVisible] = useState(false);
    const [score, setScore] = useState(null);
    const [scoreDes, setScoreDes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOk = () => {
        console.log(score, scoreDes)
        if (!score) {
            return notification.error({
                message: '请先填写分数'
            })
        }
        if (scoreDes && scoreDes.length > 255) {
            return notification.error({
                message: `【评价内容】长度应该不大于255字，当前 ${scoreDes.length} 字`
            })
        }

        setLoading(true);

        $ajax.rate({
            id: orderId,
            score,
            score_des: scoreDes || ''
        }).then(result => {
            // result = {
            //     code: 200,
            //     data: {
            //         username: '测试名'
            //     }
            // }
            if (result.code === 200) {
                notification.success({
                    message: '打分成功'
                })
                loadDetail()
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

    return <div>
        <Button type="primary"
                onClick={() => setDialogVisible(true)}>评价</Button>
        <Modal title="评价"
               visible={dialogVisible}
               onOk={handleOk}
               onCancel={() => setDialogVisible(false)}
               footer={[
                   <Button key="back" onClick={() => setDialogVisible(false)}>
                       关闭
                   </Button>,
                   <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                       评价
                   </Button>
               ]}>
            <Form labelCol={{span: 4}}
                  wrapperCol={{span: 14}}
                  size='large'>
                <Form.Item label="打分"
                           rules={[
                               {
                                   required: true,
                                   message: '请输入评分'
                               }
                           ]}>
                    <Rate tooltips={desc} value={score} onChange={setScore}/>
                    {score ? <span className="ant-rate-text">{desc[score - 1]}</span> : ''}
                </Form.Item>
                <Form.Item label="评价内容"
                           validateTrigger={['onBlur']}
                           rules={[
                               {
                                   validator (rule, value) {
                                       console.log(rule, value)
                                       if (!value) {
                                           return Promise.resolve();
                                       }
                                       if (value.length > 255) {
                                           return Promise.reject(`【评价内容】长度应该不大于255字，当前 ${!value ? 0 : value.length} 字`);
                                       }
                                       return Promise.resolve();
                                   }
                               }
                           ]}>
                    <TextArea maxLength={255}
                              style={{
                                  fontSize: '16px'
                              }}
                              value={scoreDes}
                              onChange={e => setScoreDes(e.target.value)}
                              size='large'
                              placeholder="请输入评价，字数不超过255字"
                              rows={6}/>
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default RateComponent
