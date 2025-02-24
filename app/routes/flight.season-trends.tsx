import { Card, Row, Col, Select, Tag, Radio } from 'antd';
import {  Column, Pie, Line } from '@ant-design/plots';
import { useState } from 'react';

export default function SeasonTrends() {
  const [selectedRoute, setSelectedRoute] = useState('北京-上海');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' 或 'price'

  const seasonData = {
    trends: [
      { month: '1月', passengers: 15000, flights: 420, avgPrice: 1580 },
      { month: '2月', passengers: 18000, flights: 460, avgPrice: 1680 },
      { month: '3月', passengers: 12000, flights: 380, avgPrice: 1280 },
      { month: '4月', passengers: 11000, flights: 360, avgPrice: 1180 },
      { month: '5月', passengers: 13000, flights: 400, avgPrice: 1280 },
      { month: '6月', passengers: 14000, flights: 420, avgPrice: 1380 },
      { month: '7月', passengers: 16000, flights: 480, avgPrice: 1580 },
      { month: '8月', passengers: 17000, flights: 500, avgPrice: 1680 },
      { month: '9月', passengers: 13000, flights: 420, avgPrice: 1380 },
      { month: '10月', passengers: 16000, flights: 460, avgPrice: 1580 },
      { month: '11月', passengers: 12000, flights: 380, avgPrice: 1280 },
      { month: '12月', passengers: 15000, flights: 440, avgPrice: 1480 },
    ],
    peakSeasons: [
      { season: '春节', period: '1月下旬-2月上旬', priceIncrease: '40%' },
      { season: '暑假', period: '7月-8月', priceIncrease: '35%' },
      { season: '国庆', period: '10月初', priceIncrease: '30%' },
      { season: '元旦', period: '12月底-1月初', priceIncrease: '25%' },
    ],
    distribution: [
      { type: '旺季', value: 35 },
      { type: '平季', value: 45 },
      { type: '淡季', value: 20 },
    ]
  };

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
                { value: '北京-上海', label: '北京 → 上海' },
                { value: '广州-北京', label: '广州 → 北京' },
              ]}
            />
          </Col>
          <Col>
            <Radio.Group value={activeTab} onChange={e => setActiveTab(e.target.value)}>
              <Radio.Button value="overview">季节概览</Radio.Button>
              <Radio.Button value="price">价格波动</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {activeTab === 'price' ? (
        <Card title="季节性价格波动">
          <Column
            data={seasonData.trends}
            xField="month"
            yField="avgPrice"
            label={{
              position: 'top',
            }}
            meta={{
              avgPrice: {
                alias: '平均票价',
              }
            }}
          />
        </Card>
      ) : (
        <>
          <Row gutter={24}>
            <Col span={24}>
              <Card title="全年客流量和航班数趋势" style={{ marginBottom: 24 }}>
                <Line
                  data={seasonData.trends}
                  xField="month"
                  yField="passengers"
                  smooth
                  point={{
                    size: 5,
                    shape: 'diamond',
                  }}
                  meta={{
                    passengers: {
                      alias: '旅客数量',
                    }
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="季节分析">
            <Row gutter={24}>
              <Col span={16}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ marginBottom: 16 }}>旺季分布</h3>
                  <Row gutter={[16, 16]}>
                    {seasonData.peakSeasons.map((season, index) => (
                      <Col span={6} key={index}>
                        <Card bodyStyle={{ padding: 16, textAlign: 'center' }}>
                          <h4 style={{ marginBottom: 8 }}>{season.season}</h4>
                          <p style={{ marginBottom: 8, color: '#666' }}>{season.period}</p>
                          <Tag color="red">{season.priceIncrease}</Tag>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <h3 style={{ marginBottom: 16 }}>季节分布</h3>
                  <Pie
                    data={seasonData.distribution}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                    }}
                    legend={{
                      position: 'bottom'
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
} 