import { Card, Form,  DatePicker, Button,AutoComplete,Col,List,Typography } from 'antd';
import { SearchOutlined,RocketOutlined,ClockCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { Route,SmartRoutingCriteria,CombinedRoute } from 'app/utils/types';
import { submitRouteFilters } from 'app/utils/api';
import {airports} from 'public/assets/cities'
import { Map as LeafletMap } from 'leaflet';

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
  const [userLocation, setUserLocation] = useState<[number, number]>([37.0902, -95.7129]); // 美国中心
  const mapRef = useRef<LeafletMap | null>(null);
  const buttonAddedRef = useRef(false); // 用于跟踪按钮是否已添加

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log('获取位置失败:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker }) => {
      import('leaflet').then((L) => {
        import('leaflet/dist/leaflet.css');
        
        const cityPositions: Record<string, [number, number]> = {};
        routes.forEach(route => {
          cityPositions[route.dept_city] = route.dept_pos;
          cityPositions[route.arri_city] = route.arri_pos;
        });

        // 创建自定义定位控件
        const LocationButton = L.Control.extend({
          onAdd: function(map: LeafletMap) {
            const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
            btn.style.width = '34px';
            btn.style.height = '34px';
            btn.style.backgroundColor = 'white';
            btn.style.cursor = 'pointer';
            btn.style.border = '2px solid rgba(0,0,0,0.2)';
            btn.style.borderRadius = '4px';
            btn.style.padding = '0';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.innerHTML = '<svg viewBox="64 64 896 896" width="16" height="16"><path d="M850.4 590.4c-17.6-12.8-41.6-9.6-56 8-14.4 17.6-12.8 43.2 4.8 57.6 17.6 14.4 20.8 20.8 20.8 24 0 3.2-8 12.8-36.8 32-28.8 19.2-70.4 40-120 56-49.6 16-104 27.2-160 27.2s-110.4-9.6-160-27.2c-49.6-16-91.2-36.8-120-56-28.8-19.2-36.8-28.8-36.8-32 0-3.2 3.2-9.6 20.8-24 17.6-14.4 19.2-40 4.8-57.6-14.4-17.6-38.4-20.8-56-8-41.6 32-64 64-64 89.6 0 24 20.8 52.8 62.4 81.6 35.2 24 83.2 46.4 139.2 64 56 17.6 116.8 27.2 179.2 27.2s123.2-9.6 179.2-27.2c56-17.6 104-40 139.2-64 41.6-28.8 62.4-57.6 62.4-81.6.8-25.6-21.6-57.6-62.4-89.6zM512 0C304 0 144 160 144 368c0 121.6 72 272 215.2 449.6 11.2 14.4 28.8 22.4 47.2 22.4h211.2c18.4 0 36-8 47.2-22.4C808 640 880 489.6 880 368 880 160 720 0 512 0zm0 544c-96 0-176-80-176-176s80-176 176-176 176 80 176 176-80 176-176 176z" fill="#1890ff"/></svg>';
            
            btn.onclick = function() {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 12); // 放大到用户位置
                  },
                  (error) => {
                    console.log('获取位置失败:', error);
                  }
                );
              }
            }
            
            return btn;
          }
        });

        if (routes.length > 0) {
          const positions = Object.values(cityPositions);
          const bounds = L.latLngBounds(positions);
          
          // 直接在 MapContainer 中使用 bounds.getCenter()
          setMapComponent(
            <MapContainer 
              center={[bounds.getCenter().lat, bounds.getCenter().lng]} // 使用 bounds.getCenter()
              zoom={4} 
              style={{ height: '600px', width: '100%', ...style }}
              zoomControl={true}
              scrollWheelZoom={true}
              ref={(map) => {
                mapRef.current = map;
                if (map && !buttonAddedRef.current) {
                  // 添加定位按钮
                  new LocationButton({ position: 'topleft' }).addTo(map);
                  buttonAddedRef.current = true; // 标记按钮已添加
                }
              }}
            >
              <TileLayer
                url="https://{s}.google.com/vt?x={x}&y={y}&z={z}&s=Ga" // Google Maps 瓦片
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>'
              />

              {/* 用户位置标记 */}
              <CircleMarker 
                center={userLocation}
                radius={8}
                fillColor="#1890ff"
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup>
                  <strong>您的位置</strong>
                </Popup>
              </CircleMarker>

              {/* 城市标记 */}
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
                >
                  <Popup>
                    <strong>{cityName}</strong>
                  </Popup>
                </CircleMarker>
              ))}

              {/* 航线 */}
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
        } else {
          // 如果没有路线，保持用户位置为中心
          setMapComponent(
            <MapContainer 
              center={userLocation}
              zoom={4} 
              style={{ height: '600px', width: '100%', ...style }}
              zoomControl={true}
              scrollWheelZoom={true}
              ref={(map) => {
                mapRef.current = map;
                if (map && !buttonAddedRef.current) {
                  // 添加定位按钮
                  new LocationButton({ position: 'topleft' }).addTo(map);
                  buttonAddedRef.current = true; // 标记按钮已添加
                }
              }}
            >
              <TileLayer
                url="https://{s}.google.com/vt?x={x}&y={y}&z={z}&s=Ga" // Google Maps 瓦片
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>'
              />

              {/* 用户位置标记 */}
              <CircleMarker 
                center={userLocation}
                radius={8}
                fillColor="#1890ff"
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup>
                  <strong>您的位置</strong>
                </Popup>
              </CircleMarker>

              {/* 城市标记 */}
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
                >
                  <Popup>
                    <strong>{cityName}</strong>
                  </Popup>
                </CircleMarker>
              ))}

              {/* 航线 */}
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
        }
      });
    });
  }, [routes, style, userLocation]);

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