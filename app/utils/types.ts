
//机票搜索页面
// 机票列表对象
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  aircraft: string;
  stops: number;

}

// 机票搜索条件
export interface SearchCriteria{
  airlines: string[],
  priceRange: number[],
  departureTime: string,
  aircraftTypes: string[],
  departureCity: string,
  arrivalCity: string,
  departureDate: string | null,
}


//智能组合页面

//路线对象和价格
export interface Route {
  dept_city: string;
  arri_city: string;
  dept_pos: [number, number];
  arri_pos: [number, number];
  price: string;
}

// 智能中转搜索条件

export interface SmartRoutingCriteria {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;  
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