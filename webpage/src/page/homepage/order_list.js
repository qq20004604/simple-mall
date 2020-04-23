/**
 * Created by 王冬 on 2020/4/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
/**
 * Created by 王冬 on 2020/4/22.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useState, useEffect} from 'react';
import {
    PageHeader,
    Card,
    notification,
    Col,
    Row,
    Pagination,
    Tag
} from 'antd';
import $ajax from 'api/ajax.js';

function OrderList (props) {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => loadList(), []);

    const loadList = (page = 1) => {
        const payload = {
            page_num: page
        }
        $ajax.orderList(payload).then(result => {
            // result = {
            //     code: 200,
            //     msg: '',
            //     data: null
            // }
            console.log(result)
            if (result.code === 200) {
                setTotal(result.data.total)
                setList(result.data.list)
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
    const onChange = (page, pageSize) => {
        console.log(page, pageSize)
        loadList(page)
    }

    return <div id='order-list'>
        <PageHeader
            className="site-page-header"
            title="查看订单列表"/>
        <div className='list'>
            <Row gutter={[32, 24]}>
                {
                    list.map(item => {
                        return <Col key={item.id} span={8}>
                            <Card title={item.title} extra={<a href="#">查看详情</a>}>
                                <p>
                                    <span className='create-date'>{item.create_date}</span>
                                    <span className='price'>价格：{item.price}</span>
                                </p>
                                <p className='content'>{item.content ? item.content : '这里缺少简介'}</p>
                                <p>
                                    <Tag color="blue">{item.pub_username}</Tag>
                                    {
                                        item.tag.length > 0
                                            ? item.tag.split(',').map(tag => <Tag key={tag}>{tag}</Tag>)
                                            : null
                                    }
                                </p>
                            </Card>
                        </Col>
                    })
                }
            </Row>
        </div>
        <Row>
            <Col span={16} offset={0}>
                <Pagination pageSize={20}
                            defaultCurrent={1}
                            pageSizeOptions={['20']}
                            total={total}
                            showQuickJumper
                            onChange={onChange}
                            showTotal={total => `总共 ${total} 条`}
                />
            </Col>
        </Row>
    </div>
}

export default OrderList
