from django.db import models
from django.utils import timezone
import datetime
from configuration.variable import VERIFY_CODE_EXPIRE_TIME, SMS_SEND_INTERVAL_TIME
import random


# Create your models here.
class Order(models.Model):
    send_date = models.DateTimeField(
        default=timezone.now,
        help_text='订单发布时间'
    )
    pub_user_id = models.CharField(
        max_length=20,
        help_text='订单发布人id'
    )
    title = models.CharField(
        max_length=40,
        help_text='订单名称'
    )
    content = models.CharField(
        max_length=2000,
        help_text='订单内容'
    )
    tag = models.CharField(
        default='',
        max_length=40,
        help_text='订单标签'
    )
    price = models.CharField(
        default='面谈',
        max_length=20,
        help_text='订单预期价格'
    )
    order_taker = models.CharField(
        max_length=20,
        help_text='订单接单人id'
    )
    candidate_order_taker = models.CharField(
        default='',
        max_length=255,
        help_text='候选订单接单人id，以逗号分隔用户id。最多10个人'
    )
    pub_score_taker = models.CharField(
        max_length=1,
        help_text='发单方给接单方打分，1~5分打分，5分好评'
    )
    pub_score_taker_des = models.CharField(
        max_length=255,
        help_text='发单方给接单方的评价文字内容'
    )
    taker_score_pub = models.CharField(
        max_length=1,
        help_text='接单方给发单方打分，1~5分打分，5分好评'
    )
    taker_score_pub_des = models.CharField(
        max_length=255,
        help_text='接单方给发单方的评价文字内容'
    )

    order_status_cn = {
        '00': '订单已创建',  # 默认是这个值，未来用于编辑使用
        '01': '订单已发布',  # 其他人可以浏览
        '10': '已有接单候选人',  # 对应candidate_order_taker
        '11': '已选定接单人',  # （已选定接单人），对应order_taker
        '20': '进行中',  # 11后，由接单方确认开始，进入这一步
        '21': '接单方已确认完成',  # 双方都确认完成后自动转30（21+22后自动转30）
        '22': '发单方已确认完成',  # 双方都确认完成后自动转30（21+22后自动转30）
        '30': '待评价',
        '31': '接单方已评价',  # 双方都确认完成后自动转40（31+32后自动转30）
        '32': '发单方已评价',  # 双方都确认完成后自动转40（31+32后自动转30）
        '40': '已双方互评',
        '91': '接单方已取消订单',
        '92': '发单方已取消订单',
    }

    order_status = models.CharField(
        default='00',
        max_length=3,
        help_text='订单状态'
    )

    # 显示的默认信息
    def __str__(self):
        return self.tel

    # 获得订单中文状态
    def get_order_status_cn(self):
        return self.order_status_cn[self.order_status]

    # 设置订单状态（已发布01），创建订单后调用这个
    def set_status_published(self):
        self.order_status = '01'

    # 设置订单状态（有人想要接单10）
    def set_candidate_order_taker(self, user_id):
        if self.order_status == '01' or self.order_status == '10':
            self.order_status = '10'
            if len(self.candidate_order_taker) == 0:
                self.candidate_order_taker = user_id
            else:
                # 获取 list 形式，当前所有接单人
                cot = str.split(self.candidate_order_taker, ',')
                if len(cot) > 10:
                    return '最多只能有10个人接单'

                cot.append(user_id)
                self.candidate_order_taker = ','.join(cot)
                return True
        else:
            return '当前状态，无法接单'

    # 获取候选接单人的id，返回值是一个用户id的list，例如['1','2']或[]（没人）
    def get_candidate_order_taker(self):
        if len(self.candidate_order_taker) == 0:
            return []
        else:
            return str.split(self.candidate_order_taker, ',')[:-1]

    # 移除某个候选人
    def rm_candidate_order_taker(self, user_id):
        cot = str.split(self.candidate_order_taker, ',')[:-1]
        if user_id in cot:
            # 获取索引
            i = cot.index(user_id)
            # 移除该元素，获取新的list
            new_list = cot[0:i] + cot[(i + 1):]
            # 重新拼装，并赋值
            self.candidate_order_taker = ','.join(new_list)
            return True
        else:
            return '该用户不在接单人候选列表'

    # 设置订单状态（选定接单人11）
    def set_order_taker(self, user_id):
        cot = str.split(self.candidate_order_taker, ',')[:-1]
        # 只有在候选人列表里的，才能选定他接单
        if user_id in cot:
            # 清空候选人
            self.candidate_order_taker = ''
            # 选定接单人
            self.order_taker = user_id
            return True
        else:
            return '该用户不在接单人候选列表'

    # 设置订单状态（订单进行中20）
    def set_order_doing(self, change_user_id):
        if self.order_status != '11':
            return '当前无法设置订单状态为进行中'
        if self.order_taker != change_user_id:
            return '只有接单人才能将订单状态改为进行中'
        self.order_status = '20'
        return True

    # 设置订单状态（接单方确认完成21）
    def set_order_done_by_taker(self, change_user_id):
        # 只有接单方才能调用这个函数
        if self.order_taker == change_user_id:
            if self.order_status == '20':
                self.order_status = '21'
                return True
            elif self.order_status == '22':
                self.order_status = '30'
                return True
            else:
                return '无法修改该订单状态'
        else:
            return '只有接单方才能修改'

    # 设置订单状态（发单方确认完成22）
    def set_order_done_by_pub(self, change_user_id):
        # 只有接单方才能调用这个函数
        if self.pub_user_id == change_user_id:
            if self.order_status == '20':
                self.order_status = '22'
                return True
            elif self.order_status == '21':
                self.order_status = '30'
                return True
            else:
                return '无法修改该订单状态'
        else:
            return '只有发单方才能修改'

    # 设置订单状态（接单方已评价31）
    def score_by_taker(self, change_user_id, score, score_content):
        # 只有接单方才能调用这个函数
        if self.order_taker == change_user_id:
            if self.order_status == '30':
                self.order_status = '31'
                self.taker_score_pub = score
                self.taker_score_pub_des = score_content
                return True
            elif self.order_status == '32':
                self.order_status = '40'
                self.taker_score_pub = score
                self.taker_score_pub_des = score_content
                return True
            else:
                return '该订单当前状态无法评价'
        else:
            return '只有接单方才能评价'

    # 设置订单状态（发单方已评价32）
    def score_by_pub(self, change_user_id, score, score_content):
        # 只有接单方才能调用这个函数
        if self.pub_user_id == change_user_id:
            if self.order_status == '30':
                self.order_status = '32'
                self.pub_score_taker = score
                self.pub_score_taker_des = score_content
                return True
            elif self.order_status == '31':
                self.order_status = '40'
                self.pub_score_taker = score
                self.pub_score_taker_des = score_content
                return True
            else:
                return '该订单当前状态无法评价'
        else:
            return '只有发单方才能评价'

    # 设置订单状态（接单方已取消订单91）
    def cancel_by_taker(self, change_user_id):
        # 只有接单方才能调用这个函数
        if self.order_taker == change_user_id:
            s = int(self.order_status)
            # 订单开始后>=20，订单完成前<30，才能修改
            if 20 <= s < 30:
                self.order_status = '91'
                return True
            else:
                return '该订单当前状态无法取消'
        else:
            return '只有接单方才能取消'

    # 设置订单状态（发单方已取消订单92）
    def cancel_by_pub(self, change_user_id):
        # 只有接单方才能调用这个函数
        if self.pub_user_id == change_user_id:
            s = int(self.order_status)
            # 订单开始后>=20，订单完成前<30，才能修改
            if 20 <= s < 30:
                self.order_status = '91'
                return True
            else:
                return '该订单当前状态无法取消'
        else:
            return '只有发单方才能取消'
