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
    Tag, Breadcrumb, Layout,
    Empty
} from 'antd';
import OrderDetail from './order_detail';
import {HomeOutlined, UserOutlined} from '@ant-design/icons';
import $ajax from 'api/ajax.js';

const {Content} = Layout;

function OrderList (props) {
    const {user} = props;
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0)
    const [detailId, setDetailId] = useState(null);

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
        if (page === currentPage) {
            return;
        }
        setCurrentPage(page)
        loadList(page)
    }
    let ListDOM = null;
    if (list.length === 0) {
        ListDOM = <div id='order-list'>
            <PageHeader
                className="site-page-header"
                title="订单列表"/>
                <div className="list">
                    <Empty description={'这里什么都木有'}/>
                </div>
        </div>
    } else {
        // 订单列表
        ListDOM = <div id='order-list'>
            <PageHeader
                className="site-page-header"
                title="订单列表"/>
            <div className='list'>
                <Row gutter={[32, 24]}>
                    {
                        list.length > 0 ? list.map(item => {
                            return <Col key={item.id} span={8}>
                                <Card title={item.title} extra={<a onClick={() => setDetailId(item.id)}>查看详情</a>}>
                                    <p>
                                        <span className='create-date'>{item.create_date}</span>
                                        <span className='price'>价格：{item.price}</span>
                                    </p>
                                    <p className='content wrap-text'>{item.content ? item.content : '这里缺少简介'}</p>
                                    <p>
                                        <Tag color="blue">发单人：{item.pub_username}</Tag>
                                        {
                                            item.tag.length > 0
                                                ? item.tag.split(',').map(tag => <Tag key={tag}>{tag}</Tag>)
                                                : null
                                        }
                                    </p>
                                </Card>
                            </Col>
                        }) : (<Empty description={false}/>)
                    }
                </Row>
            </div>
            <Row>
                <Col span={16} offset={0}>
                    <Pagination pageSize={20}
                                defaultCurrent={currentPage}
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

    return <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
        <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>
                <HomeOutlined/>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <a onClick={() => setDetailId(null)}>订单列表</a>
            </Breadcrumb.Item>
            {
                detailId !== null ? <Breadcrumb.Item>订单详情</Breadcrumb.Item> : null
            }

        </Breadcrumb>
        <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
            {
                detailId === null ? ListDOM : <OrderDetail id={detailId}
                                                           user={user}
                                                           setDetailId={setDetailId}/>
            }
        </div>
    </Content>
}

export default OrderList
