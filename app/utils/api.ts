import type { 
  SmartRoutingResult, 
  PriceData, 
  FlightTrend,
  WhenToFlyData,
  SeasonTrendData,
  RouteParams,
  DateRangeParams
} from './types';

const BASE_URL = '/api/flight';

// 智能路由接口
export async function searchSmartRouting(params: RouteParams): Promise<SmartRoutingResult[]> {
  const response = await fetch(`${BASE_URL}/smart-routing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

// 价格分析接口
export async function getPriceAnalysis(params: DateRangeParams): Promise<PriceData> {
  const response = await fetch(`${BASE_URL}/price-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

// 航班趋势接口
export async function getFlightTrends(route: string): Promise<FlightTrend> {
  const response = await fetch(`${BASE_URL}/trends?route=${encodeURIComponent(route)}`);
  return response.json();
}

// 何时飞接口
export async function getWhenToFly(route: string): Promise<WhenToFlyData> {
  const response = await fetch(`${BASE_URL}/when-to-fly?route=${encodeURIComponent(route)}`);
  return response.json();
}

// 季节趋势接口
export async function getSeasonTrends(route: string): Promise<SeasonTrendData> {
  const response = await fetch(`${BASE_URL}/season-trends?route=${encodeURIComponent(route)}`);
  return response.json();
}

