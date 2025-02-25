import { useState } from 'react';
import {
  Card,Form,DatePicker,Button,Table,Select,Slider,Tag,Space,Divider,Typography,
  Row,
  Col,
  Checkbox,
  AutoComplete,
} from 'antd';
import {
  SearchOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  RocketOutlined,
  CalendarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { Moment } from 'moment';
import {airports} from 'public/assets/cities'
import {airlineCodes} from 'public/assets/airlineCode'
import  {Flight, SearchCriteria} from 'app/utils/types'
import { submitFilters } from 'app/utils/api';
const { Title } = Typography;
const { Option } = Select;

const FlightSearch = () => {
  // 创建状态对象来存储筛选条件
  const [filters, setFilters] = useState<SearchCriteria>(
    {
      airlines: [],
      priceRange: [0, 5000],
      departureTime: 'all',
      aircraftTypes: [],
      departureCity: '',
      arrivalCity: '',
      departureDate: null, // 如果使用 moment.js
    }
  );

  // 创建状态对象来存储航班数据
  const [flights, setFlights] = useState<Flight[]>([]); // 初始化航班数据状态

  // 更新航空公司选择
  const handleAirlineChange = (checkedValues: string[]) => {
    setFilters((prev) => ({ ...prev, airlines: checkedValues }));
  };

  // 更新价格区间
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: value }));
  };

  // 更新起飞时间选择
  const handleDepartureTimeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, departureTime: value }));
  };
  // 更新出发地
  const handleDepartureChange = (value: string) => {
    setFilters((prev) => ({ ...prev, departureCity: value }));
  };

  // 更新到达地
  const handleArrivalChange = (value: string) => {
    setFilters((prev) => ({ ...prev, arrivalCity: value }));
  };

  // 更新出发日期
  const handleDateChange = (date: Moment | null) => {
    const formattedDate = date ? date.format('YYYYMMDD') : null; // 转换为字符串格式
    setFilters((prev) => ({ ...prev, departureDate: formattedDate })); // 更新状态
  };

  // 提交筛选条件到后端
  const handleSubmit = async () => {
      const data = await submitFilters(filters);

      // 检查返回的数据是否成功，并提取 data 数组
      if (data.length > 0) {
        setFlights(data); // 更新航班数据状态
      } else {
        setFlights([]); // 如果格式不正确，设置为空数组
      }
  };

  const columns = [
    {
      title: '航空公司',
      dataIndex: 'airline',
      key: 'airline',
      render: (text: string) => (
        <Space>
          <img src={`/airlineCnImg/${airlineCodes[text]}.svg`} alt={text} style={{ width: 24 }} />
          <span style={{ fontWeight: 'bold', fontSize: '16px' }} >{text}</span>
        </Space>
      )
    },
    {
      title: '航班信息',
      key: 'flight',
      render: (record: Flight) => (
        <Space direction="vertical" size="small">
          <div>
            <Typography.Text strong>{record.departureTime}</Typography.Text>
            <SwapOutlined style={{ margin: '0 8px' }} />
            <Typography.Text strong>{record.arrivalTime}</Typography.Text>
          </div>
          <div style={{ color: '#666' }}>
            {record.departure} → {record.arrival}
          </div>
          <Tag color="blue">{record.flightNumber}</Tag>
        </Space>
      )
    },
    {
      title: '飞行时长',
      key: 'duration',
      render: (record: Flight) => (
        <Space>
          <ClockCircleOutlined />
          <span>{record.duration}</span>
        </Space>
      )
    },
    {
      title: '机型',
      key: 'aircraft',
      render: (record: Flight) => (
        <Space>
          <RocketOutlined />
          <span>{record.aircraft}</span>
        </Space>
      )
    },
    {
      title: '价格',
      key: 'price',
      render: (record: Flight) => (
        <Typography.Text type="danger" strong>
          <DollarOutlined /> ¥{record.price}
        </Typography.Text>
      ),
      sorter: (a: Flight, b: Flight) => a.price - b.price
    },
  ];

  // 生成自动补全选项
  const options = airports.map(loc => ({
    value: `${loc.value}`, // 显示地点和三字码
  }));

  return (
    <div>
      {/* 搜索区域 */}
      <Card className="search-card" style={{ marginBottom: 24 }}>
        <Form layout="horizontal">
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="departure city">
                <AutoComplete
                  options={options}
                  onChange={handleDepartureChange}
                  placeholder="Please enter the departure city"
                  prefix={<RocketOutlined rotate={-45} />}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="arrival city">
                <AutoComplete
                  options={options}
                  onChange={handleArrivalChange}
                  placeholder="Please enter the arrive city"
                  prefix={<RocketOutlined rotate={45} />}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="departure day">
                <DatePicker 
                  style={{ width: '100%' }}
                  onChange={handleDateChange}
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button type="primary" icon={<SearchOutlined />} block onClick={handleSubmit}>
                搜索航班
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={24}>
        {/* 筛选器侧边栏 */}
        <Col span={6}>
          <Card title={<><FilterOutlined /> Filter criteria</>}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Airline Company</Title>
              <Checkbox.Group onChange={handleAirlineChange} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Checkbox value="CA">American Airlines</Checkbox>
                <Checkbox value="MU">Delta Air Lines</Checkbox>
                <Checkbox value="CZ">United Airlines</Checkbox>
                <Checkbox value="HU">JetBlue Airways</Checkbox>
                <Checkbox value="MF">Spirit Airlines</Checkbox>
                <Checkbox value="9C">Sun Country Airlines</Checkbox>
              </Checkbox.Group>
            </div>
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>price Range</Title>
              <Slider 
                range 
                defaultValue={[0, 5000]} 
                max={10000}
                onChange={handlePriceChange}
                marks={{
                  0: '$0',
                  10000: '$1000'
                }}
              />
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={5}>take-off time</Title>
              <Select style={{ width: '100%' }} defaultValue="all" onChange={handleDepartureTimeChange}>
                <Option value="all">all</Option>
                <Option value="morning">morning(06:00-12:00)</Option>
                <Option value="afternoon">afternoon(12:00-18:00)</Option>
                <Option value="evening">evening(18:00-24:00)</Option>
              </Select>
            </div>

            <Divider />
            <Divider />

            <button onClick={handleSubmit}>搜索航班</button>
          </Card>
        </Col>

        {/* 航班列表 */}
        <Col span={18}>
          <Card>
            <Table 
              columns={columns} 
              dataSource={flights}
              pagination={{ pageSize: 6 }}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FlightSearch; 