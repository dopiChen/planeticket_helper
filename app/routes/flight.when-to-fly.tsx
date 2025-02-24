import { Card, Row, Col, Select, Statistic, Tooltip } from 'antd';
import {  Column, DualAxes } from '@ant-design/plots';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function WhenToFly() {
  const [selectedRoute, setSelectedRoute] = useState('北京-上海');

  const weekdayData = [
    { day: '周一', avgPrice: 1180, discount: 95 },
    { day: '周二', avgPrice: 1150, discount: 92 },
    { day: '周三', avgPrice: 1100, discount: 88 },
    { day: '周四', avgPrice: 1160, discount: 93 },
    { day: '周五', avgPrice: 1350, discount: 108 },
    { day: '周六', avgPrice: 1580, discount: 126 },
    { day: '周日', avgPrice: 1480, discount: 118 },
  ];

  const yearData = weekdayData.map(item => ({
    ...item,
    flightCount: Math.floor(Math.random() * 50) + 30
  }));

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Select
              value={selectedRoute}
              onChange={setSelectedRoute}
              style={{ width: 200 }}
              options={[
                { value: '北京-上海', label: '北京 → 上海' },
                { value: '广州-北京', label: '广州 → 北京' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={12}>
          <Card 
            title={
              <span>
                最佳出行日 
                <Tooltip title="基于历史数据分析的最优惠日期">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic 
                  title="最优惠日期" 
                  value="周三"
                  suffix={<small style={{ color: '#52c41a' }}>-12%</small>}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="最优惠时段" 
                  value="凌晨"
                  suffix={<small style={{ color: '#52c41a' }}>-15%</small>}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="平均节省" 
                  value="￥280"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="每周价格趋势" style={{ marginBottom: 24 }}>
            <Column
              data={weekdayData}
              xField="day"
              yField="avgPrice"
              label={{
                position: 'top',
                style: {
                  fill: '#666',
                }
              }}
              meta={{
                avgPrice: {
                  alias: '平均价格',
                }
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card title="价格与航班数量对比">
            <DualAxes
              data={[yearData, yearData]}
              xField="day"
              yField={['avgPrice', 'flightCount']}
              geometryOptions={[
                {
                  geometry: 'column',
                  color: '#5B8FF9',
                },
                {
                  geometry: 'line',
                  lineStyle: {
                    lineWidth: 2,
                  },
                  color: '#F6BD16',
                },
              ]}
              meta={{
                avgPrice: {
                  alias: '平均价格',
                  min: 0,
                },
                flightCount: {
                  alias: '航班数量',
                  min: 0,
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 