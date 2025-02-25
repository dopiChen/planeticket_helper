// export const airlineCodes: { [key: string]: string } = {
//     '中国国际航空': 'CA',
//     '东方航空': 'MU',
//     '南方航空': 'CZ',
//     '海南航空': 'HU',
//     '厦门航空': 'MF',
//     '春秋航空': '9C',
//     '吉祥航空': 'HO',
//     '四川航空': '3U',
//     '深圳航空': 'ZH',
//     '上海航空': 'FM',
//     '山东航空': 'SC',
//     '祥鹏航空': '8L',
//     '中国联合航空': 'KN',
//     '华夏航空': 'G5',
//     '长龙航空': 'GJ',
//     '成都航空': 'EU',
//     '多彩贵州航空': 'GY',
//     '东海航空': 'DZ',
//     '福州航空': 'FU',
//     '桂林航空': 'GT',
//     '江西航空': 'RY',
//     '九元航空': 'AQ',
//     '昆明航空': 'KY',
//     '龙江航空': 'LT',
//     '瑞丽航空': 'DR',
//     '天津航空': 'GS',
//     '北部湾航空': 'GX',
//     '乌鲁木齐航空': 'UQ',
//     '西部航空': 'PN',
//     '西藏航空': 'TV',
//     '幸福航空': 'JR',
//     '青岛航空': 'QW',
//     '金鹏航空': 'Y8',
//     '首都航空': 'JD',
//     '奥凯航空': 'BK',
//     '中联航': 'KN',
//     '英安航空': 'XJ',
//     '大新华航空': 'CN',
//   };

export const airlineCodes: { [key: string]: string } = {
  'American Airlines': 'AA',         // 正确
  'Delta Air Lines': 'DL',          // 正确
  'United Airlines': 'UA',          // 正确
  'Southwest Airlines': 'WN',       // 正确
  'JetBlue Airways': 'B6',          // 正确
  'Alaska Airlines': 'AS',          // 正确
  'Hawaiian Airlines': 'HA',        // 正确
  'Spirit Airlines': 'NK',          // 正确
  'Frontier Airlines': 'F9',        // 正确
  'Virgin America': 'VX',           // 已于2018年与Alaska Airlines合并，代码不再使用，但保留历史记录无误
  'Mesa Air Group': 'YV',           // 修正：Mesa Airlines的正确代码是'YV'，'YX'错误
  'Piedmont Airlines': 'PT',        // 修正：Piedmont的正确代码是'PT'，'MQ'属于Envoy Air
  'Republic Airways': 'YX',         // 正确
  'SkyWest Airlines': 'OO',         // 正确
  'Allegiant Air': 'G4',            // 正确
  'Sun Country Airlines': 'SY',     // 正确
  'Envoy Air': 'MQ',                // 正确，'MQ'是Envoy Air的代码
  'Compass Airlines': 'CP',         // 修正：Compass的正确代码是'CP'，'QX'属于Horizon Air
  'GoJet Airlines': 'G7',           // 正确
  'Parker Aviation': 'P9', 
           // 不确定，可能是一家小型或虚构航空公司，'P9'暂无冲突，保留
};