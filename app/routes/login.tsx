import { useState } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import { Card, Input, Button } from 'antd';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

//   const handleLogin = async (values: any) => {
//     try {
//       // 登录逻辑...
      
//       // 存储token和用户角色
//       localStorage.setItem('token', 'your-token');
//       localStorage.setItem('userRole', values.role); // 'admin' 或 'user'

//       // 登录成功后跳转
//       if (returnUrl) {
//         navigate(decodeURIComponent(returnUrl));
//       } else {
//         // 根据角色跳转到对应的首页
//         navigate(values.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
//       }
//     } catch (error) {
//       // 处理错误...
//     }
//   };
const handleLogin = () => {
  if (username === 'admin' && password === 'admin') {
    localStorage.setItem('token', 'admin-token');
    localStorage.setItem('userRole', 'admin');
    navigate(returnUrl ? decodeURIComponent(returnUrl) : '/flight/flights-search');
  } else if (username === 'user' && password === 'user') {
    localStorage.setItem('token', 'user-token');
    localStorage.setItem('userRole', 'user');
    navigate(returnUrl ? decodeURIComponent(returnUrl) : '/flight/flights-search');
  } else {
    alert('用户名或密码错误');
  }
};

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: `url('/bk3.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Card style={{ 
        width: 400, 
        textAlign: 'center',
        position: 'relative',
        paddingTop: '80px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'spin 5s linear infinite'
        }}>
          <img 
            src="/logo.svg" 
            alt="Logo" 
            style={{ 
              width: '150px',
            }} 
          />
        </div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          marginBottom: '32px',
          marginTop: '20px'
        }}>
          Login
        </h1>
        <div style={{ marginBottom: '16px' }}>
          <Input 
            size="large"
            placeholder="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <Input.Password 
            size="large"
            placeholder="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <Button 
          type="primary" 
          size="large" 
          block 
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
      <style>{`
        @keyframes spin {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
