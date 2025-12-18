
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; email: string } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-3xl">💰</span> SmartFinance
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" label="儀表板" />
          <NavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon="💸" label="收支紀錄" />
          <NavItem active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon="🏦" label="銀行帳戶" />
          <NavItem active={activeTab === 'fortune'} onClick={() => setActiveTab('fortune')} icon="🔮" label="每日運勢" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <span>🚪</span> 登出系統
          </button>
        </div>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" label="儀表" />
        <MobileNavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon="💸" label="紀錄" />
        <MobileNavItem active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon="🏦" label="帳戶" />
        <MobileNavItem active={activeTab === 'fortune'} onClick={() => setActiveTab('fortune')} icon="🔮" label="運勢" />
        <button onClick={onLogout} className="flex flex-col items-center p-2 text-rose-500">
          <span className="text-xl">🚪</span>
          <span className="text-[10px]">登出</span>
        </button>
      </nav>

      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex md:hidden items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">SmartFinance</h1>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
      active ? 'text-indigo-600' : 'text-slate-400'
    }`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Layout;
