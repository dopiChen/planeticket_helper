import { Card, Row, Col, Form, Radio, Tooltip,AutoComplete,DatePicker,Button } from 'antd';
import { Heatmap, Column,Bar,Pie } from '@ant-design/plots';
import { useState } from 'react';
import { InfoCircleOutlined,RocketOutlined,CalendarOutlined,SearchOutlined } from '@ant-design/icons';
import { FlightTrendsCriteria } from 'app/utils/types';
import {airports} from 'public/assets/cities'
import type { Dayjs } from 'dayjs';
import { HeatmapData, FlightCountDistribution, FlightTimeDistribution, FlightStopCountDistribution } from 'app/utils/types';
import { submitFlightTrendsFilters } from 'app/utils/api';
export default function FlightTrends() {
  const [activeView, setActiveView] = useState('main'); // 'main', 'trends', 'top5'
  const [criteria, setCriteria] = useState<FlightTrendsCriteria>({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
  });
  const [heatmapData,setHeatmapData] = useState<HeatmapData[]>([]);
  const [monthlyTrends,setMonthlyTrends] = useState<FlightCountDistribution[]>([]);
  const [dayTime,setDayTime] = useState<FlightTimeDistribution[]>([]);
  const [stopover,setStopover] = useState<FlightStopCountDistribution[]>([]);
  const handleDepartureChange = (value: string) => {
    setCriteria(prev => ({ ...prev, departureCity: value }));
  };

  const handleArrivalChange = (value: string) => {
    setCriteria(prev => ({ ...prev, arrivalCity: value }));
  };
  const handleDateChange = (date: Dayjs | null) => {
    const formattedDate = date ? date.format('YYYYMMDD') : ''; 
    setCriteria(prev => ({ ...prev, departureDate: formattedDate }));
  };

   // 提交筛选条件到后端
   const handleSubmit = async () => {
    const data = await submitFlightTrendsFilters(criteria);
    // 检查返回的数据是否成功，并提取 data 数组
    if (data) {
      setHeatmapData(data['heatmapData']);
      setMonthlyTrends(data['flightCountDistribution']);
      setDayTime(data['flightTimeDistribution']);
      setStopover(data['flightStopCountDistribution']);
      console.log(stopover.length);// 更新航班数据状态
    } else {
      console.log('数据为空');
      setHeatmapData([]);
      setMonthlyTrends([]);
      setDayTime([]);
      setStopover([]);

    }
};
  // 生成自动补全选项
  const options = airports.map(loc => ({
    value: `${loc.value}`, // 显示地点和三字码
  }));


  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle" justify="space-between">
        <Col span={7}>
              <Form.Item label="出发地">
                <AutoComplete
                  options={options}
                  onChange={handleDepartureChange}
                  placeholder="请输入出发城市"
                  prefix={<RocketOutlined rotate={-45} />}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="目的地">
                <AutoComplete
                  options={options}
                  onChange={handleArrivalChange}
                  placeholder="请输入到达城市"
                  prefix={<RocketOutlined rotate={45} />}
                />
              </Form.Item>
            </Col>
              <Form.Item label="出发日期">
                <DatePicker 
                  style={{ width: '100%' }}
                  onChange={handleDateChange}
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>
              <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSubmit}>
                搜索航线
              </Button>
            </Form.Item>

          <Col>
            <Radio.Group 
              value={activeView} 
              onChange={e => setActiveView(e.target.value)}
              style={{ marginRight: 16 }}
            >
              <Radio.Button value="main">主视图</Radio.Button>
              <Radio.Button value="trends">数量分析</Radio.Button>
              <Radio.Button value="top5">时段分析</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {activeView === 'main' ? (
        <>
          <Row gutter={24}>
            <Col span={24}>
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
                  shape="square"
                  heatmapStyle={{
                    fill: '#1890FF',
                    fillOpacity: (d: { value: number }) => (d.value - 20) / 100,
                    stroke: '#1890FF',
                    strokeOpacity: 0.1,
                  }}
                />
              </Card>
            </Col>
            {/* <Col span={8}>
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
            </Col> */}
          </Row>
        </>
      ) : activeView === 'trends' ? (
        <Card 
        title={
          <span>
            航班数量分析 
            <Tooltip title="展示不同月份的航班数量起伏">
              <InfoCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </span>
        }
        style={{ marginBottom: 24 }}
      >
          <Column
            data={monthlyTrends}
            xField="month"
            yField="count"
            label={{
              position: 'top',
              style: {
                fill: '#666',
              },
            }}
            color="#1890ff"
            columnStyle={{
              radius: [4, 4, 0, 0],
            }}
            meta={{
              month: {
                alias: '月份',
              },
              count: {
                alias: '航班数量',
              },
            }}
            height={400}
          />
        </Card>
      ) : (
        <Card 
        title={
          <span>
            航班时段经停分布 
            <Tooltip title="展示一天内不同时段的航班数量和经停次数">
              <InfoCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </span>
        }
        style={{ marginBottom: 24 }}
      >
                <Row gutter={24}>
        <Col span={12}>
          <Card title="时段分布">
            <Bar
              data={dayTime}
              xField="time"
              yField="count"
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
              data={stopover}
              angleField="count"
              colorField="stopCount"
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
        </Card>
      )}
    </div>
  );
}