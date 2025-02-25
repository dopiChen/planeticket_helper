
//...机票搜索页面
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


//...智能组合页面 

//路线对象和价格
export interface Route {
  dept_city: string;
  arri_city: string;
  dept_pos: [number, number];
  arri_pos: [number, number];
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  price: string;
}


// 完整路线（可能包含多个航段）
export interface CombinedRoute {
  segments: Route[];     // 航段数组
  totalPrice: number;            // 总价格
  totalDuration: number;         // 总飞行时间（分钟）
  transferCount: number;         // 中转次数
  transferDuration?: number;     // 总中转时间（分钟）
  isDirectFlight: boolean;       // 是否直飞
}

// 智能中转搜索条件

export interface SmartRoutingCriteria {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;  
}


//...价格分析页面

//价格分析搜索条件

export interface PriceAnalysisCriteria {
  departureCity: string;//出发城市
  arrivalCity: string;//到达城市
  startDate: string;//开始日期
  endDate: string;//结束日期
}


//价格分析数据

export interface PriceAnalysisData {
  date: string;
  price: number;
}









