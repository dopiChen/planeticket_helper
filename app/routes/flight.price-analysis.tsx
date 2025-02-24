import { Card, Row, Col, Select, DatePicker } from 'antd';
import { Line, Bar, Pie } from '@ant-design/plots';
import { useState } from 'react';

export default function PriceAnalysis() {
  const [selectedRoute, setSelectedRoute] = useState('北京-上海');

  // 模拟数据
  const priceData = {
    trend: [
      { date: '2024-03-01', price: 1200 },
      { date: '2024-03-02', price: 1380 },
      { date: '2024-03-03', price: 1150 },
      { date: '2024-03-04', price: 980 },
      { date: '2024-03-05', price: 1420 },
      { date: '2024-03-06', price: 1680 },
      { date: '2024-03-07', price: 1580 },
      { date: '2024-03-08', price: 1890 }, // 周末价格上涨
      { date: '2024-03-09', price: 1950 },
      { date: '2024-03-10', price: 1480 },
      { date: '2024-03-11', price: 1280 },
      { date: '2024-03-12', price: 1180 },
    ],
    dayTime: [
      { time: '凌晨(00:00-06:00)', avgPrice: 980, count: 120 },
      { time: '早上(06:00-12:00)', avgPrice: 1200, count: 350 },
      { time: '下午(12:00-18:00)', avgPrice: 1150, count: 280 },
      { time: '晚上(18:00-24:00)', avgPrice: 1050, count: 220 },
    ],
    stopover: [
      { type: '直飞', percentage: 60, avgPrice: 1200 },
      { type: '经停1次', percentage: 25, avgPrice: 1050 },
      { type: '经停2次', percentage: 10, avgPrice: 950 },
      { type: '经停2次以上', percentage: 5, avgPrice: 850 },
    ]
  };

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
                // ... 更多路线
              ]}
            />
          </Col>
          <Col>
            <DatePicker.RangePicker />
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={24}>
          <Card title="未来价格走势" style={{ marginBottom: 24 }}>
            <Line
              data={priceData.trend}
              xField="date"
              yField="price"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              style={{ height: 300 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="时段分布">
            <Bar
              data={priceData.dayTime}
              xField="time"
              yField="avgPrice"
              columnStyle={{
                radius: [4, 4, 0, 0],
              }}
              label={{
                position: 'top',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="经停分析">
            <Pie
              data={priceData.stopover}
              angleField="percentage"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
              }}
              interactions={[
                { type: 'element-active' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 