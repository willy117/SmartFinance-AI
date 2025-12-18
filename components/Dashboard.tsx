
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BankAccount, Transaction, TransactionType } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions }) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  // Calculate this month's summary
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = currentMonthTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Category data for Pie Chart
  const categoryData = Object.entries(
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
   .sort((a, b) => b.value - a.value);

  // Trend data for Bar Chart (Last 6 months)
  const getTrendData = () => {
    const data: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mLabel = `${d.getMonth() + 1}月`;
      
      const mTrans = transactions.filter(t => t.date.startsWith(mStr));
      const income = mTrans.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
      const expense = mTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
      
      data.push({ name: mLabel, 收入: income, 支出: expense });
    }
    return data;
  };

  const trendData = getTrendData();
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setLoadingAdvice(true);
    const advice = await getFinancialAdvice(transactions, accounts);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && !aiAdvice) {
      fetchAdvice();
    }
  }, [transactions.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">財務報告與儀表板</h2>
          <p className="text-slate-500">掌握您的資產動向，獲得 AI 個人化理財分析。</p>
        </div>
        <button 
          onClick={fetchAdvice}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
          disabled={loadingAdvice || transactions.length === 0}
        >
          {loadingAdvice ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              正在分析中...
            </>
          ) : (
            <>✨ 重新整理 AI 建議</>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          label="總資產 (合計)" 
          value={`$${totalBalance.toLocaleString()}`} 
          color="text-indigo-600" 
          icon="💰"
          bg="bg-indigo-50"
          desc="所有帳戶總和"
        />
        <SummaryCard 
          label="本月總收入" 
          value={`$${totalIncome.toLocaleString()}`} 
          color="text-emerald-600" 
          icon="📈"
          bg="bg-emerald-50"
          desc={`${now.getMonth() + 1}月累計`}
        />
        <SummaryCard 
          label="本月總支出" 
          value={`$${totalExpense.toLocaleString()}`} 
          color="text-rose-600" 
          icon="📉"
          bg="bg-rose-50"
          desc={`${now.getMonth() + 1}月累計`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            <span>收支趨勢 (半年)</span>
            <span className="text-xs font-normal text-slate-400">數據更新至今日</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="收入" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="支出" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenditure Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">歷史支出分類佔比</h3>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '金額']}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                <span className="text-4xl mb-2">📊</span>
                <p>尚無支出紀錄可顯示圖表</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <span className="text-9xl">🤖</span>
        </div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-900">
          <span className="bg-indigo-100 p-2 rounded-lg">✨</span> AI 智能財富管家建議
        </h3>
        <div className="flex-1 bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 min-h-[200px] border border-indigo-100">
          {loadingAdvice ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-600/70 py-10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              </div>
              <p className="font-medium">您的財務大腦正在全速運轉中...</p>
            </div>
          ) : aiAdvice ? (
            <div className="prose prose-indigo max-w-none">
              {aiAdvice.split('\n').filter(l => l.trim()).map((line, i) => {
                const isBullet = line.trim().startsWith('-') || /^\d+\./.test(line.trim());
                return (
                  <p key={i} className={`${isBullet ? 'pl-4 border-l-2 border-indigo-200 ml-2' : ''} mb-4 text-slate-700 leading-relaxed font-medium`}>
                    {line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
              <p className="text-center">
                尚未生成建議。<br/>
                請確保您至少有一筆交易紀錄，然後點擊「取得 AI 建議」。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: string; color: string; icon: string; bg: string; desc: string }> = ({ label, value, color, icon, bg, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-2xl font-black ${color} my-1`}>{value}</p>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
