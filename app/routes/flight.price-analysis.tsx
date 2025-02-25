import { Card, Row, Col,  DatePicker ,AutoComplete,Form, Alert, Tag, Typography, Button } from 'antd';
import { Line, } from '@ant-design/plots';
import { useState } from 'react';
import { RocketOutlined, ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import {airports} from 'public/assets/cities'
import { PriceAnalysisCriteria,PriceAnalysisData } from 'app/utils/types';
import type { Dayjs } from 'dayjs';
import { submitPriceAnalysisFilters } from 'app/utils/api';

export default function PriceAnalysis() {


  const [criteria, setCriteria] = useState<PriceAnalysisCriteria>({
    departureCity: '',
    arrivalCity: '',
    startDate: '',
    endDate: '',
  });
  const [priceData, setPriceData] = useState<PriceAnalysisData[]>([]);

  // 生成自动补全选项
  const options = airports.map(loc => ({
    value: `${loc.value}`, // 显示地点和三字码
  }));

  
  // 提交筛选条件到后端
  const handleSubmit = async () => {
    const data = await submitPriceAnalysisFilters(criteria);

    // 检查返回的数据是否成功，并提取 data 数组
    if (data.length > 0) {
      setPriceData(data); // 更新航班数据状态
    } else {
      setPriceData([]); // 如果格式不正确，设置为空数组
    }
};

  // 更新函数
  const handleDepartureChange = (value: string) => {
    setCriteria(prev => ({ ...prev, departureCity: value }));
  };

  const handleArrivalChange = (value: string) => {
    setCriteria(prev => ({ ...prev, arrivalCity: value }));
  };

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setCriteria(prev => ({
        ...prev,
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }));
    }
  };

  // 添加分析函数
  const analyzePriceTrends = (data: typeof priceData) => {
    const highestPrice = Math.max(...data.map(item => item.price));
    const lowestPrice = Math.min(...data.map(item => item.price));
    const highestDate = data.find(item => item.price === highestPrice)?.date;
    const lowestDate = data.find(item => item.price === lowestPrice)?.date;

    return { highestPrice, lowestPrice, highestDate, lowestDate };
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
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
          <Col span={8}>
            <Form.Item label="日期范围">
              <DatePicker.RangePicker 
                onChange={handleDateChange}
                format="YYYYMMDD"
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSubmit}>
                搜索
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={24}>
          <Card title="未来价格走势" style={{ marginBottom: 24 }}>
            <Line
              data={priceData}
              xField="date"
              yField="price"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              style={{ height: 300 }}
            />
            
            {/* 分析结论区域 */}
            {priceData.length > 0 && (
              <div style={{ 
                marginTop: 24, 
                padding: '16px 24px',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <Row gutter={[24, 16]}>
                  <Col span={24}>
                    <Alert
                      message="价格走势分析"
                      description="以下分析基于历史数据预测，仅供参考。建议关注实时价格变化。"
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Card
                      size="small"
                      style={{ background: '#fff7e6', border: '1px solid #ffe7ba' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowUpOutlined style={{ color: '#fa541c', fontSize: 20 }} />
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>预计最高价格</div>
                          <div>
                            <Tag color="orange">
                              <CalendarOutlined /> {analyzePriceTrends(priceData).highestDate}
                            </Tag>
                            <span style={{ marginLeft: 8, color: '#fa541c', fontWeight: 'bold' }}>
                              ¥{analyzePriceTrends(priceData).highestPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      size="small"
                      style={{ background: '#e6fffb', border: '1px solid #b5f5ec' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowDownOutlined style={{ color: '#13c2c2', fontSize: 20 }} />
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>预计最低价格</div>
                          <div>
                            <Tag color="cyan">
                              <CalendarOutlined /> {analyzePriceTrends(priceData).lowestDate}
                            </Tag>
                            <span style={{ marginLeft: 8, color: '#13c2c2', fontWeight: 'bold' }}>
                              ¥{analyzePriceTrends(priceData).lowestPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <div style={{ 
                      padding: '12px 16px', 
                      background: '#ffffff',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9'
                    }}>
                      <Typography.Text type="secondary">
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        建议：{analyzePriceTrends(priceData).lowestPrice < priceData[0].price ? 
                          '当前价格处于相对高位，建议等待价格回落后再购买。' : 
                          '当前价格相对较低，是较好的购买时机。'}
                      </Typography.Text>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
} 