import  {notification} from 'antd';


import  { SearchCriteria,SmartRoutingCriteria} from 'app/utils/types'


//实时查询机票接口
export const submitFilters = async (filters:SearchCriteria) => {
  try {
    const response = await fetch('http://127.0.0.1:4523/m1/5909167-5596115-default/api/flight/flights-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters), // 将筛选条件作为请求体发送
    });

    if (!response.ok) {
      throw new Error('请求失败');
    }

    const result = await response.json(); // 获取完整的响应对象
    console.log('返回的数据:', result);

    // 检查返回的数据是否成功，并提取 data 数组
    if (result.success && Array.isArray(result.data)) {
      return result.data; // 返回获取的航班数据
    } else {
      console.error('返回的数据格式不正确:', result);
      return []; // 如果格式不正确，返回空数组
    }
  } catch (error) {
    console.error('请求错误:', error);
    notification.error({
      message: '网络错误',
      description: '请求失败，请检查网络连接或稍后重试。',
      placement: 'topRight', // 提示栏位置
    });
    return []; // 如果发生错误，返回空数组
  }
};

// 智能路线接口
//实时查询机票接口
export const submitRouteFilters = async (filters:SmartRoutingCriteria) => {
  try {
    const response = await fetch('http://127.0.0.1:4523/m1/5909167-5596115-default/api/flight/smart-routing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters), // 将筛选条件作为请求体发送
    });

    if (!response.ok) {
      throw new Error('请求失败');
    }

    const result = await response.json(); // 获取完整的响应对象
    console.log('返回的数据:', result);

    // 检查返回的数据是否成功，并提取 data 数组
    if (result.success && Array.isArray(result.data)) {
      return result.data; // 返回获取的航班数据
    } else {
      console.error('返回的数据格式不正确:', result);
      return []; // 如果格式不正确，返回空数组
    }
  } catch (error) {
    console.error('请求错误:', error);
    notification.error({
      message: '网络错误',
      description: '请求失败，请检查网络连接或稍后重试。',
      placement: 'topRight', // 提示栏位置
    });
    return []; // 如果发生错误，返回空数组
  }
};
