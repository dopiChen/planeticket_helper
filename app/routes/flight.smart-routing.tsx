import { Card, Form, Input, DatePicker, Button } from 'antd';
import { SearchOutlined} from '@ant-design/icons';
import { useState, useEffect } from 'react';

// 创建 useHydrated hook
function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}

interface Route {
  from: { name: string; position: [number, number] };
  to: { name: string; position: [number, number] };
  price: string;
}

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
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              tileSize={256}
              zoomOffset={0}
            />
            {routes.map((route, idx) => (
              <div key={idx}>
                <Marker position={route.from.position}>
                  <Popup>
                    <strong>{route.from.name}</strong>
                  </Popup>
                </Marker>
                <Marker position={route.to.position}>
                  <Popup>
                    <strong>{route.to.name}</strong>
                  </Popup>
                </Marker>
                <Polyline 
                  positions={[route.from.position, route.to.position]}
                  color="#1890ff"
                  weight={3}
                  opacity={0.8}
                  dashArray="5, 10"
                />
              </div>
            ))}
          </MapContainer>
        );
      });
    });
  }, [routes]);

  return MapComponent;
}

export default function SmartRouting() {
  const isHydrated = useHydrated();
  const [routes] = useState<Route[]>([
    {
      from: { name: '北京', position: [39.9042, 116.4074] as [number, number] },
      to: { name: '东京', position: [35.6762, 139.6503] as [number, number] },
      price: '¥2,500'
    },
    {
      from: { name: '上海', position: [31.2304, 121.4737] as [number, number] },
      to: { name: '首尔', position: [37.5665, 126.9780] as [number, number] },
      price: '¥2,100'
    }
  ]);

  return (
    <Card title="智能航线拼接" className="route-card">
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Form.Item label="出发地">
          <Input placeholder="请输入出发城市" />
        </Form.Item>
        <Form.Item label="目的地">
          <Input placeholder="请输入目的城市" />
        </Form.Item>
        <Form.Item label="出发日期">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />}>
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