
import React, { useState, useEffect } from 'react';
// Import centralized auth functions from our firebase service
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import Fortune from './components/Fortune';
import Auth from './components/Auth';
import { auth, isConfigured, onAuthStateChanged } from './services/firebase';
import { dbService } from './services/dbService';
import { User, BankAccount, Transaction } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is configured before attempting auth operations
    if (!isConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    // Use centralized onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const u: User = { 
          id: firebaseUser.uid, 
          email: firebaseUser.email || "", 
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "使用者" 
        };
        setCurrentUser(u);
        setIsDemo(false);
        await loadData(u.id, false);
      } else if (!isDemo) {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const loadData = async (userId: string, demoMode: boolean) => {
    try {
      const [accs, trans] = await Promise.all([
        dbService.getAccounts(userId, demoMode),
        dbService.getTransactions(userId, demoMode)
      ]);
      setAccounts(accs);
      setTransactions(trans);
    } catch (e) {
      console.error("資料載入失敗:", e);
    }
  };

  const handleLogin = (user: User, demo: boolean) => {
    setCurrentUser(user);
    setIsDemo(demo);
    loadData(user.id, demo);
  };

  const handleLogout = () => {
    if (auth) auth.signOut();
    setCurrentUser(null);
    setIsDemo(false);
    setActiveTab('dashboard');
  };

  const handleAddAccount = async (acc: Omit<BankAccount, 'id' | 'userId'>) => {
    if (!currentUser) return;
    await dbService.addAccount({ ...acc, userId: currentUser.id }, isDemo);
    await loadData(currentUser.id, isDemo);
  };

  const handleDeleteAccount = async (id: string) => {
    if (!currentUser) return;
    if (window.confirm("確定刪除此帳戶與其所有關聯資料？")) {
      await dbService.deleteAccount(id, isDemo);
      await loadData(currentUser.id, isDemo);
    }
  };

  const handleAddTransaction = async (t: Omit<Transaction, 'id' | 'userId'>) => {
    if (!currentUser) return;
    await dbService.addTransaction({ ...t, userId: currentUser.id }, isDemo);
    await loadData(currentUser.id, isDemo);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">系統安全初始化中...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      <div className="mb-4">
        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <span>💡</span> 您目前正在使用「展示模式」，資料將儲存於瀏覽器本地，登出後仍會保留，但無法跨裝置同步。
          </div>
        )}
      </div>
      {activeTab === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} />}
      {activeTab === 'transactions' && (
        <Transactions 
          transactions={transactions} 
          accounts={accounts} 
          onAdd={handleAddTransaction} 
          onDelete={() => alert("功能開發中，請先透過刪除帳戶重置資料。")} 
        />
      )}
      {activeTab === 'accounts' && (
        <Accounts 
          accounts={accounts} 
          onAdd={handleAddAccount} 
          onUpdate={() => alert("目前編輯功能僅限正式帳戶。")} 
          onDelete={handleDeleteAccount} 
        />
      )}
      {activeTab === 'fortune' && <Fortune userName={currentUser.name} />}
    </Layout>
  );
};

export default App;
