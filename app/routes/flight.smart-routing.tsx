import { Card, Form,  DatePicker, Button,AutoComplete } from 'antd';
import { SearchOutlined,RocketOutlined,} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Route,SmartRoutingCriteria } from 'app/utils/types';
import { submitRouteFilters } from 'app/utils/api';
import {airports} from 'public/assets/cities'

// 创建 useHydrated hook
function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}

// 创建 Map 组件
// 设置地图显示样式
function Map({ routes }: { routes: Route[] }) {
  const [MapComponent, setMapComponent] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, Polyline }) => {
      import('leaflet').then((L) => {
        import('leaflet/dist/leaflet.css');
        
        const DefaultIcon = L.icon({
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        setMapComponent(
          <MapContainer 
            center={[35, 105]} 
            zoom={4} 
            style={{ height: '600px', width: '100%', borderRadius: '8px' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
              subdomains={['1', '2', '3', '4']}
              attribution='&copy; 高德地图'
            />
            {routes.map((route, idx) => {
              // 计算曲线的控制点（使路线呈弧形）
              const latlngs = route.dept_pos;
              const latlnge = route.arri_pos;
              const latlngc = [
                (latlngs[0] + latlnge[0]) / 2,
                (latlngs[1] + latlnge[1]) / 2 + 
                Math.abs(latlnge[1] - latlngs[1]) / 5 // 调整弧度
              ];

              // 计算飞机图标的角度
              const angle = Math.atan2(
                latlnge[1] - latlngs[1],
                latlnge[0] - latlngs[0]
              ) * 180 / Math.PI - 30;

              return (
                <div key={idx}>
                  {/* 使用自定义图标显示起点终点 */}
                  <Popup position={route.dept_pos}>
                    <strong>{route.dept_city}</strong>
                  </Popup>
                  <Popup position={route.arri_pos}>
                    <strong>{route.arri_city}</strong>
                  </Popup>

                  {/* 绘制曲线 */}
                  <Polyline 
                    positions={[
                      route.dept_pos,
                      [latlngc[0], latlngc[1]] as [number, number],
                      route.arri_pos
                    ]}
                    color="#ff4d4f"
                    weight={2}
                    opacity={0.8}
                    smoothFactor={1}
                    dashArray="5, 3"
                  />

                  {/* 添加飞机图标和价格标签 */}
                  <Marker 
                    position={[latlngc[0], latlngc[1]] as [number, number]}
                    icon={L.divIcon({
                      html: `
                        <div style="
                          transform: rotate(${angle}deg);
                          font-size: 24px;
                          color: #ff4d4f;
                        ">✈️</div>
                        <div style="
                          position: absolute;
                          top: 24px;
                          left: 50%;
                          transform: translateX(-50%);
                          background-color: #ff4d4f;
                          color: white;
                          padding: 2px 8px;
                          border-radius: 12px;
                          font-size: 12px;
                          white-space: nowrap;
                        ">¥${route.price}</div>
                      `,
                      className: 'flight-icon',
                      iconSize: [24, 24],
                      iconAnchor: [12, 12]
                    })}
                  />
                </div>
              );
            })}
          </MapContainer>
        );
      });
    });
  }, [routes]);

  return MapComponent;
}

export default function SmartRouting() {
  const isHydrated = useHydrated();
  //状态变量
  const [filters, setFilters] = useState<SmartRoutingCriteria>({
    departureCity: '',
    arrivalCity: '',
    departureDate: ''
  }); 
  // 提交筛选条件到后端
  const handleSubmit = async () => {
    const data = await submitRouteFilters(filters);
    //更新地图
    // 检查返回的数据是否成功，并提取 data 数组
    if (data.length > 0) {
      setRoute(data); // 更新航班数据状态
    } else {
      setRoute([]); // 如果格式不正确，设置为空数组
    }
};

const [routes, setRoute] = useState<Route[]>([]);
  
  //更新函数
  // 更新出发地
  const handleDeptChange = (checkedValues: string) => {
    setFilters((prev) => ({ ...prev, departureCity: checkedValues }));
  };
  // 更新目的地
  const handleArriChange = (checkedValues: string) => {
    setFilters((prev) => ({ ...prev, arrivalCity: checkedValues }));
  };
  // 更新出发日期
  const handleDateChange = (date: string) => {
    setFilters((prev) => ({ ...prev, departureDate: date }));
  }

  //路线实例数据
  // const [routes] = useState<Route[]>([
  //   {
  //     dept_city: '北京',
  //     arri_city: '上海',
  //     dept_pos: [39.9042, 116.4074],
  //     arri_pos: [31.2304, 121.4737],
  //     price: '1,200'
  //   },
  //   {
  //     dept_city: '上海',
  //     arri_city: '广州',
  //     dept_pos: [31.2304, 121.4737],
  //     arri_pos: [23.1291, 113.2644],
  //     price: '1,500'
  //   },
  //   {
  //     dept_city: '广州',
  //     arri_city: '深圳',
  //     dept_pos: [23.1291, 113.2644],
  //     arri_pos: [22.5431, 114.0579],
  //     price: '800'
  //   },
  //   {
  //     dept_city: '成都',
  //     arri_city: '北京',
  //     dept_pos: [30.5728, 104.0668],
  //     arri_pos: [39.9042, 116.4074],
  //     price: '1,700'
  //   },
    // {
    //   dept_city: '重庆',
    //   arri_city: '上海',
    //   dept_pos: [29.5630, 106.5516],
    //   arri_pos: [31.2304, 121.4737],
    //   price: '1,400'
    // },
    // {
    //   dept_city: '杭州',
    //   arri_city: '南京',
    //   dept_pos: [30.2741, 120.1551],
    //   arri_pos: [32.0603, 118.7969],
    //   price: '1,100'
    // },
    // {
    //   dept_city: '武汉',
    //   arri_city: '厦门',
    //   dept_pos: [30.5928, 114.3055],
    //   arri_pos: [24.4798, 118.0895],
    //   price: '1,300'
    // }
  // ]);
  // 生成自动补全选项
  const options = airports.map(loc => ({
    value: `${loc.value}`, // 显示地点和三字码
  }));
  return (
    <Card title="智能航线拼接" className="route-card">
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Form.Item label="出发地">
          <AutoComplete
            value={filters.departureCity}
            options={options}
            onChange={handleDeptChange}
            placeholder="请输入出发城市"
            prefix={<RocketOutlined rotate={-45} />}
          />
        </Form.Item>
        <Form.Item label="目的地">
          <AutoComplete
            value={filters.arrivalCity}
            options={options}
            onChange={handleArriChange}
            placeholder="请输入目的地"
            prefix={<RocketOutlined rotate={45} />}
          />
        </Form.Item>
        <Form.Item label="出发日期">
          <DatePicker 
            onChange={(date) => handleDateChange(date ? date.format('YYYYMMDD') : '')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSubmit}>
            搜索航线
          </Button>
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          {isHydrated ? (
            <Map routes={routes} />
          ) : (
            <div style={{ 
              height: '600px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              加载地图中...
            </div>
          )}
        </div>

        {/* <div style={{ flex: 1 }}>
          <List
            itemLayout="vertical"
            dataSource={routes}
            renderItem={route => (
              <List.Item>
                <Card 
                  size="small" 
                  style={{ 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                    <Typography.Text strong>{route.from.name}</Typography.Text>
                    <ArrowRightOutlined style={{ color: '#1890ff' }} />
                    <Typography.Text strong>{route.to.name}</Typography.Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Typography.Text type="success" strong>
                      {route.price}
                    </Typography.Text>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div> */}
      </div>
    </Card>
  );
}