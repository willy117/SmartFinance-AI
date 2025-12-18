
import React, { useState } from 'react';
// Import centralized auth functions from our firebase service to ensure compatibility
import { 
  auth, 
  isConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from '../services/firebase';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User, isDemo: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: "demo-user-id",
      email: "demo@example.com",
      name: "展示訪客"
    };
    onLogin(demoUser, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isConfigured || !auth) {
      setError('系統目前未配置 Firebase，請使用展示模式登入。');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Correct modular usage using imported functions from service
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const u = userCredential.user;
        onLogin({
          id: u.uid,
          email: u.email || "",
          name: u.displayName || u.email?.split('@')[0] || "使用者"
        }, false);
      } else {
        // Correct modular usage for registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const u = userCredential.user;
        await updateProfile(u, { displayName: name });
        onLogin({
          id: u.uid,
          email: u.email || "",
          name: name
        }, false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('電子郵件或密碼錯誤');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('此電子郵件已被註冊');
      } else {
        setError('驗證失敗：' + (err.message || '未知錯誤'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg shadow-indigo-100">
            💰
          </div>
          <h1 className="text-2xl font-bold">SmartFinance</h1>
          <p className="text-slate-500 text-center">
            {isLogin ? '歡迎回來，請登入您的帳戶' : '立即加入，開啟您的理財生活'}
          </p>
          {!isConfigured && (
            <span className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              ⚠️ 目前為離線/展示模式
            </span>
          )}
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6 border border-rose-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">您的姓名</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                placeholder="王小明"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? '驗證中...' : (isLogin ? '正式模式登入' : '註冊帳號')}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative px-4 bg-white text-slate-400 text-sm">或</span>
        </div>

        <button 
          onClick={handleDemoLogin}
          className="w-full py-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all mb-6"
        >
          🚀 進入展示模式 (不需帳號)
        </button>

        <div className="text-center text-sm text-slate-500">
          {isLogin ? '想要體驗正式功能？' : '已經有帳號了？'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? '點此註冊' : '點此登入'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
