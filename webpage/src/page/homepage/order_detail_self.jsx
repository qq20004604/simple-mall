/**
 * Created by 王冬 on 2020/4/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useEffect, useState} from 'react';
import {PageHeader, notification, Descriptions, Badge, Tag, Select, Button} from 'antd';
import $ajax from 'api/ajax.js';
import OrderDetail from './order_detail';

const {Option} = Select;

function OrderDetailSelf (props) {
    const {id, setDetailId, user} = props;
    const {usertype, userid} = user;
    useEffect(() => loadDetail(), []);
    const [selectingOrder, setSelectingOrder] = useState(false)
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
        $ajax.orderDetailPrivate({id}).then(result => {
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

    const [selectOrderTakerBtnLoading, setSelectOrderTakerBtnLoading] = useState(false)
    // 选择接单人
    const selectOrderTaker = () => {
        if (!selectTaker) {
            return notification.warning({
                message: '请先选择接单人'
            })
        }
        setSelectOrderTakerBtnLoading(true)
        $ajax.setOrderTaker({
            'order_id': orderDetail.id,       // 订单 id。当接单时，传订单id给后端
            'user_id': selectTaker       // 接单人的id
        }).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                notification.success({
                    message: '选择接单人成功'
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
            setSelectOrderTakerBtnLoading(false)
        })
    }

    const [selectTaker, setSelectTaker] = useState('')
    // 从接单候选人里选一位
    const SelectOrderTakerDOM = () => {
        // 要求：用户该订单的发单人
        if (orderDetail.pub_user_id !== userid || orderDetail.order_status !== '10') {
            return null
        }
        if (selectingOrder) {
            return <React.Fragment>
                <Select style={{width: 200}}
                        onChange={setSelectTaker}
                        allowClear>
                    {
                        orderDetail.candidate_order_taker_username.split(',').map((name, index) => {
                            const orderId = orderDetail.candidate_order_taker.split(',')[index]
                            return <Option key={orderId} value={orderId}>{name}</Option>
                        })
                    }
                </Select>
                <Button type="primary"
                        style={{marginLeft: 20}}
                        loading={selectOrderTakerBtnLoading}
                        onClick={() => selectOrderTaker(true)}>确定</Button>
                <Button type="normal"
                        style={{marginLeft: 20}}
                        onClick={() => setSelectingOrder(false)}>取消</Button>
            </React.Fragment>
        } else {
            return <Button type="primary"
                           onClick={() => setSelectingOrder(true)}>选取接单人</Button>
        }
    }

    const [beginOrderLoading, setBeginOrderLoading] = useState(false)
    const beginOrder = () => {
        setBeginOrderLoading(true)
        $ajax.beginOrder({
            id: orderDetail.id
        }).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                notification.success({
                    message: '订单已开始'
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
        }).finally(() =>
            setBeginOrderLoading(false)
        )
    }
    // 开始订单
    const BeginOrderDOM = () => {

        // 需要自己是接单人，且订单状态为11
        if (orderDetail.order_taker === userid && orderDetail.order_status === '11') {
            return <Button type="primary"
                           loading={beginOrderLoading}
                           onClick={beginOrder}>开始订单</Button>
        } else {
            return null
        }
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
            <Descriptions.Item label="订单状态"><span
                style={{color: 'red'}}>{orderDetail.order_status_cn}</span></Descriptions.Item>
            <Descriptions.Item label="订单标签" span={2}>
                {
                    orderDetail.tag.length > 0
                        ? orderDetail.tag.split(',').map(tag => <Tag key={tag} color={'processing'}>{tag}</Tag>)
                        : null
                }
            </Descriptions.Item>
            {
                orderDetail.order_status < 11 ? (<Descriptions.Item label="参与接单人" span={3}>
                    {
                        orderDetail.candidate_order_taker_username.length > 0
                            ? orderDetail.candidate_order_taker_username.split(',').map(tag => <Tag key={tag}
                                                                                                    color={'warning'}>{tag}</Tag>)
                            : '尚无人接单'
                    }
                </Descriptions.Item>) : null
            }

            <Descriptions.Item label="订单描述" span={3}>
                {orderDetail.content}
            </Descriptions.Item>
            <Descriptions.Item label="接单人">{orderDetail.order_taker_username}</Descriptions.Item>
            <Descriptions.Item label="选定接单人时间">{orderDetail.order_set_taker_date}</Descriptions.Item>
            <Descriptions.Item label="接单方确认开始时间">{orderDetail.order_begin_doing_date}</Descriptions.Item>
            <Descriptions.Item label="接单方确认完成时间">{orderDetail.order_done_by_taker_date}</Descriptions.Item>
            <Descriptions.Item label="发单方确认完成时间" span={2}>{orderDetail.order_done_by_pub_date}</Descriptions.Item>
            <Descriptions.Item label="接单方评价时间">{orderDetail.order_scored_by_taker_date}</Descriptions.Item>
            <Descriptions.Item label="发单方评价时间" span={2}>{orderDetail.order_scored_by_pub_date}</Descriptions.Item>
            <Descriptions.Item label="接单方取消订单时间">{orderDetail.order_canceled_by_taker_date}</Descriptions.Item>
            <Descriptions.Item label="发单方取消订单时间" span={2}>{orderDetail.order_canceled_by_pub_date}</Descriptions.Item>
            <Descriptions.Item label="接单方打分">{orderDetail.taker_score_pub}</Descriptions.Item>
            <Descriptions.Item label="发单方打分" span={2}>{orderDetail.pub_score_taker}</Descriptions.Item>
            <Descriptions.Item label="接单方评价内容" span={3}>{orderDetail.taker_score_pub_des}</Descriptions.Item>
            <Descriptions.Item label="发单方评价内容" span={3}>{orderDetail.pub_score_taker_des}</Descriptions.Item>
            <Descriptions.Item label="操作">
                {
                    SelectOrderTakerDOM()
                }
                {
                    BeginOrderDOM()
                }
            </Descriptions.Item>
        </Descriptions>
    </div>
}

export default OrderDetailSelf
