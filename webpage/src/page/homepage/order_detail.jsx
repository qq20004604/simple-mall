/**
 * Created by 王冬 on 2020/4/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useEffect, useState} from 'react';
import {PageHeader, notification, Descriptions, Button, Select, Tag} from 'antd';

import $ajax from 'api/ajax.js';
import GLOBAL_VAR from 'common/config/variable'

function OrderDetail (props) {
    const {id, setDetailId, user} = props;
    const {usertype, userid} = user;
    useEffect(() => loadDetail(), []);
    const [orderDetail, setOrderDetail] = useState({
        'id': '',      // 订单id
        'create_date': '',     // 订单创建时间
        'pub_user_id': '',             // 订单发单人的id
        'pub_username': '',   // 订单发单人的username
        'title': '',
        'content': '',      // 订单描述（只取前100个字作为简略）
        'tag': '',          // 订单标签，多个标签以逗号分隔
        'price': '',      // 订单价格
        'candidate_order_taker': '',     // 候选接单人
        'candidate_order_taker_username': '',     // 候选接单人
        'order_status_cn': '',     // 订单状态的文字内容
        'order_status': ''     // 订单状态的状态码
    })

    const loadDetail = () => {
        $ajax.orderDetailPublic({id}).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                console.log(result)
                setOrderDetail(result.data)
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
        })
    }

    const [takeBtnLoading, setTakeBtnLoading] = useState(false)

    const orderTake = () => {
        setTakeBtnLoading(true)
        $ajax.takeOrder({id}).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                notification.success({
                    message: '提交成功'
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
            setTakeBtnLoading(false)
        })
    }

    // 接单按钮（注意，订单状态只有【未接单】和【已有接单候选人】两个状态）
    const GetTakeOrderDOM = function () {
        // 用户类型是接单人（包含未登录）
        if (usertype !== GLOBAL_VAR.USER_TYPE_TAKER) {
            return null
        }
        // 并且该用户不是该订单的创建者
        if (orderDetail.pub_user_id === userid) {
            return null
        }
        // 也不是这个订单的接单人（已接单当然不能再接了）
        if (orderDetail.order_taker === userid) {
            return null
        }
        // 并且不是这个订单的候选接单人
        if (orderDetail.candidate_order_taker.split(',').indexOf(userid) > -1) {
            return <Descriptions.Item label="操作">
                <Button type="info" disabled={true}>已参与接单</Button>
            </Descriptions.Item>
        }
        return <Descriptions.Item label="操作">
            <Button type="primary"
                    onClick={orderTake}
                    loading={takeBtnLoading}>接单</Button>
        </Descriptions.Item>
    }

    return <div id='order-list'>
        <PageHeader
            onBack={() => setDetailId(null)}
            className="site-page-header"
            title="查看订单详情"/>
        <Descriptions bordered>
            <Descriptions.Item label="订单名称" span={3}>{orderDetail.title}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{orderDetail.create_date}</Descriptions.Item>
            <Descriptions.Item label="创建人">{orderDetail.pub_username}</Descriptions.Item>
            <Descriptions.Item label="价格">{orderDetail.price}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
                <span style={{color: 'red'}}>
                {orderDetail.order_status_cn}
                    {orderDetail.order_status === '10' ? `（${orderDetail.candidate_order_taker_username.split(',').length}人）` : ''}
            </span>
            </Descriptions.Item>
            <Descriptions.Item label="订单标签" span={2}>
                {
                    orderDetail.tag.length > 0
                        ? orderDetail.tag.split(',').map(tag => <Tag key={tag} color={'processing'}>{tag}</Tag>)
                        : null
                }
            </Descriptions.Item>
            <Descriptions.Item label="参与接单人" span={3}>
                {
                    orderDetail.candidate_order_taker_username.length > 0
                        ? orderDetail.candidate_order_taker_username.split(',').map(tag => <Tag key={tag}
                                                                                                color={'warning'}>{tag}</Tag>)
                        : '尚无人接单'
                }
            </Descriptions.Item>
            <Descriptions.Item label="订单描述" span={3}>
                {orderDetail.content}
            </Descriptions.Item>
            {
                GetTakeOrderDOM()
            }
        </Descriptions>
    </div>
}

export default OrderDetail
