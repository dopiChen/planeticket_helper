// 定义受保护的路由
export const PROTECTED_ROUTES = ['/flight', '/admin', '/user'];

// 定义公开路由
export const PUBLIC_ROUTES = ['/login', '/'];

// 检查是否已认证
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// 获取用户角色
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// 登出函数
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
}; 