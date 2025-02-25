import { Card, Form,  DatePicker, Button,AutoComplete,Col,List,Typography } from 'antd';
import { SearchOutlined,RocketOutlined,ClockCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Route,SmartRoutingCriteria,CombinedRoute } from 'app/utils/types';
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
function Map({ routes, style }: { routes: Route[]; style?: React.CSSProperties }) {
  const [MapComponent, setMapComponent] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker }) => {
      import('leaflet').then((L) => {
        import('leaflet/dist/leaflet.css');
        
        // 使用对象而不是 Map
        const cityPositions: Record<string, [number, number]> = {};
        routes.forEach(route => {
          cityPositions[route.dept_city] = route.dept_pos;
          cityPositions[route.arri_city] = route.arri_pos;
        });

        setMapComponent(
          <MapContainer 
            center={[35.8617, 104.1954]}
            zoom={5} 
            style={{ height: '600px', width: '100%', ...style }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
              subdomains={['1', '2', '3', '4']}
              attribution='&copy; 高德地图'
            />

            {/* 绘制城市标记 */}
            {Object.entries(cityPositions).map(([cityName, position]) => (
              <CircleMarker 
                key={cityName}
                center={position}
                radius={8}
                fillColor="#52c41a"
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              />
            ))}

            {/* 绘制航线 */}
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
  }, [routes, style]);

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

  const [routes, setRoute] = useState<Route[]>([]);
  const[combineroutes,setCombineroutes]=useState<CombinedRoute[]>([]);
  const [showList, setShowList] = useState(false);
    // 提取所有航段的方法
  const extractAllRoutes = (combinedRoutes: CombinedRoute[]): Route[] => {
    return combinedRoutes.flatMap(route => route.segments);
  };
  // 提交筛选条件到后端
  const handleSubmit = async () => {
    const data = await submitRouteFilters(filters);
    
    if (data.length > 0) {
      const allRoutes = extractAllRoutes(data);
      setRoute(allRoutes);
      setCombineroutes(data);
      setShowList(true);
      // 地图会自动调整到新的中心点
    } else {
      setRoute([]);
      setCombineroutes([]);
      setShowList(false);
    }
  };
  
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

  
  // 生成自动补全选项
  const options = airports.map(loc => ({
    value: `${loc.value}`, // 显示地点和三字码
  }));
  return (
    <Card title="智能航线拼接" className="route-card">
      <Form layout="inline" style={{ marginBottom: '20px' }}>
      <Col span={7}>
              <Form.Item label="出发地">
                <AutoComplete
                  options={options}
                  onChange={handleDeptChange}
                  placeholder="请输入出发城市"
                  prefix={<RocketOutlined rotate={-45} />}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="目的地">
                <AutoComplete
                  options={options}
                  onChange={handleArriChange}
                  placeholder="请输入到达城市"
                  prefix={<RocketOutlined rotate={45} />}
                />
              </Form.Item>
            </Col>
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
        {/* 列表部分 - 条件渲染 */}
        {showList && (
          <div style={{ 
            flex: '0 0 350px',
            marginRight: '20px'
          }}>
            <List
              itemLayout="vertical"
              dataSource={combineroutes}
              renderItem={(route: CombinedRoute) => (
                <List.Item>
                  <Card 
                    size="small" 
                    style={{ 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }}
                  >
                    {/* 路线类型和总价格显示 */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '4px 8px',
                      backgroundColor: route.isDirectFlight ? '#e6f7ff' : '#fff7e6',
                      borderRadius: '4px'
                    }}>
                      <Typography.Text strong>
                        {route.isDirectFlight ? '直飞' : `${route.transferCount}次中转`}
                      </Typography.Text>
                      <Typography.Text type="danger" strong>
                        ¥{route.totalPrice}
                      </Typography.Text>
                    </div>

                    {/* 航段信息 */}
                    {route.segments.map((segment, index) => (
                      <div key={index} style={{ 
                        padding: '8px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        marginBottom: index < route.segments.length - 1 ? '8px' : 0
                      }}>
                        {/* 出发信息 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div>
                            <Typography.Text strong>{segment.dept_city}</Typography.Text>
                            <Typography.Text type="secondary" style={{ marginLeft: '8px' }}>
                              {new Date(segment.departureTime).toLocaleTimeString()}
                            </Typography.Text>
                          </div>
                          <Typography.Text type="secondary">{segment.flightNumber}</Typography.Text>
                        </div>

                        {/* 到达信息 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <Typography.Text strong>{segment.arri_city}</Typography.Text>
                            <Typography.Text type="secondary" style={{ marginLeft: '8px' }}>
                              {new Date(segment.arrivalTime).toLocaleTimeString()}
                            </Typography.Text>
                          </div>
                          <Typography.Text>¥{segment.price}</Typography.Text>
                        </div>
                      </div>
                    ))}

                    {/* 中转信息 */}
                    {!route.isDirectFlight && route.transferDuration && (
                      <div style={{ 
                        marginTop: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#faad14'
                      }}>
                        <ClockCircleOutlined /> 总中转时间：{Math.floor(route.transferDuration / 60)}小时{route.transferDuration % 60}分钟
                      </div>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}
        
        {/* 地图部分 */}
        <div style={{ flex: 1, minHeight: '600px' }}>
          {isHydrated ? (
            <Map 
              routes={routes} 
              style={{ height: '100%', borderRadius: '8px' }}
            />
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
      </div>
    </Card>
  );
}