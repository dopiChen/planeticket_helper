// 基础类型
export interface Route {
  from: {
    name: string;
    position: [number, number];
  };
  to: {
    name: string;
    position: [number, number];
  };
}

export interface City {
  name: string;
  position: [number, number];
}

// 智能路由页面
export interface SmartRoutingResult extends Route {
  price: string;
  duration: string;
  stops: number;
}

// 价格分析页面
export interface PriceData {
  trend: {
    date: string;
    price: number;
  }[];
  dayTime: {
    time: string;
    avgPrice: number;
    count: number;
  }[];
  stopover: {
    type: string;
    percentage: number;
    avgPrice: number;
  }[];
}

// 航班趋势页面
export interface FlightTrend {
  hotRoutes: {
    from: string;
    to: string;
    count: number;
    avgPrice: number;
  }[];
  discountFlights: {
    route: string;
    discount: string;
    originalPrice: number;
    currentPrice: number;
  }[];
  heatmapData: {
    day: string;
    hour: number;
    value: number;
  }[];
  monthlyTrends: {
    month: string;
    flights: number;
    load: number;
    price: number;
    passengerCount: number;
  }[];
}

// 何时飞页面
export interface WhenToFlyData {
  bestTime: {
    bestDay: string;
    bestDayDiscount: number;
    bestTimeSlot: string;
    bestTimeDiscount: number;
    averageSaving: number;
  };
  weekdayData: {
    day: string;
    avgPrice: number;
    discount: number;
    flightCount: number;
  }[];
}

// 季节趋势页面
export interface SeasonTrendData {
  trends: {
    month: string;
    passengers: number;
    flights: number;
    avgPrice: number;
  }[];
  peakSeasons: {
    season: string;
    period: string;
    priceIncrease: string;
  }[];
  distribution: {
    type: string;
    value: number;
  }[];
}

// 请求参数类型
export interface RouteParams {
  from: string;
  to: string;
  date?: string;
}

export interface DateRangeParams {
  from: string;
  to: string;
  route: string;
}