import { Card, Row, Col, Select, Radio, Tooltip, Tag, Statistic } from 'antd';
import { Heatmap, Column, Area, DualAxes } from '@ant-design/plots';
import { useState } from 'react';
import { InfoCircleOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

export default function FlightTrends() {
  const [selectedRoute, setSelectedRoute] = useState('北京-上海');
  const [timeRange, setTimeRange] = useState('month');

  // 热门航线数据
  const hotRoutes = [
    { from: '北京', to: '上海', count: 150, avgPrice: 1200 },
    { from: '广州', to: '北京', count: 120, avgPrice: 1500 },
    { from: '深圳', to: '上海', count: 100, avgPrice: 1300 },
    { from: '成都', to: '北京', count: 90, avgPrice: 1600 },
    { from: '杭州', to: '北京', count: 85, avgPrice: 1100 },
  ];

  // 优惠航班数据
  const discountFlights = [
    { route: '北京-上海', discount: '7.5折', originalPrice: 1500, currentPrice: 1125 },
    { route: '广州-上海', discount: '8折', originalPrice: 1300, currentPrice: 1040 },
    { route: '深圳-北京', discount: '8.5折', originalPrice: 1800, currentPrice: 1530 },
    { route: '成都-广州', discount: '7折', originalPrice: 1400, currentPrice: 980 },
    { route: '杭州-成都', discount: '7.8折', originalPrice: 1200, currentPrice: 936 },
  ];

  // 航班热力图数据
  const heatmapData = Array.from({ length: 7 }, (_, i) => 
    Array.from({ length: 24 }, (_, j) => ({
      day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      hour: j,
      value: Math.floor(Math.random() * 100) + 20
    }))
  ).flat();

  // 月度趋势数据
  const monthlyTrends = [
    { month: '1月', flights: 450, load: 0.85, price: 1200 },
    { month: '2月', flights: 420, load: 0.82, price: 1180 },
    { month: '3月', flights: 480, load: 0.88, price: 1250 },
    { month: '4月', flights: 500, load: 0.90, price: 1300 },
    { month: '5月', flights: 520, load: 0.92, price: 1350 },
    { month: '6月', flights: 550, load: 0.95, price: 1400 },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle" justify="space-between">
          <Col>
            <Select
              value={selectedRoute}
              onChange={setSelectedRoute}
              style={{ width: 200 }}
              options={[
                { value: '北京-上海', label: '北京 ↔ 上海' },
                { value: '广州-北京', label: '广州 ↔ 北京' },
              ]}
            />
          </Col>
          <Col>
            <Radio.Group value={timeRange} onChange={e => setTimeRange(e.target.value)}>
              <Radio.Button value="week">周视图</Radio.Button>
              <Radio.Button value="month">月视图</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            title={
              <span>
                航班热力分布 
                <Tooltip title="展示不同时段航班密度，深色表示航班较多">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Heatmap
              data={heatmapData}
              xField="hour"
              yField="day"
              colorField="value"
              color={['#BAE7FF', '#1890FF', '#0050B3']}
              meta={{
                hour: {
                  type: 'cat',
                  values: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                },
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="当前优惠航班" style={{ marginBottom: 24 }}>
            {discountFlights.map((flight, index) => (
              <Card.Grid style={{ width: '100%' }} key={index}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <div>{flight.route}</div>
                    <Tag color="green">{flight.discount}</Tag>
                  </Col>
                  <Col>
                    <div style={{ textDecoration: 'line-through', color: '#999' }}>
                      ¥{flight.originalPrice}
                    </div>
                    <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
                      ¥{flight.currentPrice}
                    </div>
                  </Col>
                </Row>
              </Card.Grid>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card title="航班趋势分析">
            <DualAxes
              data={[monthlyTrends, monthlyTrends]}
              xField="month"
              yField={['flights', 'load']}
              geometryOptions={[
                {
                  geometry: 'column',
                  color: '#1890ff',
                },
                {
                  geometry: 'line',
                  lineStyle: { lineWidth: 2 },
                  color: '#f5222d',
                  point: {
                    size: 5,
                    shape: 'diamond',
                  },
                },
              ]}
              meta={{
                flights: {
                  alias: '航班数量',
                  min: 0,
                },
                load: {
                  alias: '客座率',
                  min: 0,
                  max: 1,
                  formatter: (v) => `${(v * 100).toFixed(0)}%`,
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card 
            title="热门航线TOP5" 
            extra={
              <Radio.Group defaultValue="count">
                <Radio.Button value="count">按航班量</Radio.Button>
                <Radio.Button value="price">按价格</Radio.Button>
              </Radio.Group>
            }
          >
            <Row gutter={[16, 16]}>
              {hotRoutes.map((route, index) => (
                <Col span={4} key={index}>
                  <Card bodyStyle={{ padding: 16, textAlign: 'center' }}>
                    <Statistic
                      title={`${route.from} → ${route.to}`}
                      value={route.count}
                      suffix="班/周"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <div style={{ marginTop: 8 }}>
                      均价：¥{route.avgPrice}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 