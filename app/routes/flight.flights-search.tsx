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

  // 更新机型选择
  const handleAircraftChange = (checkedValues: string[]) => {
    setFilters((prev) => ({ ...prev, aircraftTypes: checkedValues }));
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
            <Col span={7}>
              <Form.Item label="出发日期">
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
          <Card title={<><FilterOutlined /> 筛选条件</>}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>航空公司</Title>
              <Checkbox.Group onChange={handleAirlineChange} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Checkbox value="CA">中国国际航空</Checkbox>
                <Checkbox value="MU">东方航空</Checkbox>
                <Checkbox value="CZ">南方航空</Checkbox>
                <Checkbox value="HU">海南航空</Checkbox>
                <Checkbox value="MF">厦门航空</Checkbox>
                <Checkbox value="9C">春秋航空</Checkbox>
              </Checkbox.Group>
            </div>
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>价格区间</Title>
              <Slider 
                range 
                defaultValue={[0, 5000]} 
                max={10000}
                onChange={handlePriceChange}
                marks={{
                  0: '¥0',
                  10000: '¥10000'
                }}
              />
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={5}>起飞时间</Title>
              <Select style={{ width: '100%' }} defaultValue="all" onChange={handleDepartureTimeChange}>
                <Option value="all">不限</Option>
                <Option value="morning">早上 (06:00-12:00)</Option>
                <Option value="afternoon">下午 (12:00-18:00)</Option>
                <Option value="evening">晚上 (18:00-24:00)</Option>
              </Select>
            </div>

            <Divider />

            <div>
              <Title level={5}>机型选择</Title>
              <Checkbox.Group onChange={handleAircraftChange} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Checkbox value="737-800">波音737-800</Checkbox>
                <Checkbox value="737-max">波音737 MAX</Checkbox>
                <Checkbox value="787-9">波音787-9</Checkbox>
                <Checkbox value="a320">空客A320</Checkbox>
                <Checkbox value="a320neo">空客A320neo</Checkbox>
                <Checkbox value="a350">空客A350</Checkbox>
                <Checkbox value="a330-300">空客A330-300</Checkbox>
                <Checkbox value="777-300er">波音777-300ER</Checkbox>
                <Checkbox value="a380">空客A380</Checkbox>
                <Checkbox value="emb190">巴西航空工业E190</Checkbox>
                <Checkbox value="crj900">加拿大航空CRJ900</Checkbox>
                <Checkbox value="q400">德哈维兰Q400</Checkbox>
                <Checkbox value="arj21">中国商飞ARJ21</Checkbox>
                <Checkbox value="c919">中国商飞C919</Checkbox>
              </Checkbox.Group>
            </div>

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