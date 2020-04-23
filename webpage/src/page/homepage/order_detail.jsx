/**
 * Created by 王冬 on 2020/4/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useEffect, useState} from 'react';
import {PageHeader, notification, Descriptions, Badge, Tag} from 'antd';
import $ajax from 'api/ajax.js';

function OrderDetail (props) {
    const {id, setDetailId} = props;
    useEffect(() => loadDetail(), []);
    const [orderDetail, setOrderDetail] = useState({
        'id': '',      // 订单id
        'create_date': '',     // 订单创建时间
        'pub_user_id': '',             // 订单发布人的id
        'pub_username': '',   // 订单发布人的username
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
    console.log(orderDetail)

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
            <Descriptions.Item label="订单状态">{orderDetail.order_status_cn}</Descriptions.Item>
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
            <Descriptions.Item label="订单描述">
                {orderDetail.content}
            </Descriptions.Item>
        </Descriptions>
    </div>
}

export default OrderDetail
