
import React, { useState } from 'react';
import { Transaction, TransactionType, Category, BankAccount } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  onAdd: (t: Omit<Transaction, 'id' | 'userId'>) => void;
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, accounts, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    type: TransactionType.EXPENSE,
    category: Category.FOOD,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !formData.accountId) return;
    onAdd(formData);
    setIsAdding(false);
    setFormData({
      ...formData,
      amount: 0,
      note: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">收支紀錄</h2>
          <p className="text-slate-500">管理您的每一筆收入與支出。</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          {isAdding ? '取消' : '＋ 新增紀錄'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })}
              >
                <option value={TransactionType.EXPENSE}>支出</option>
                <option value={TransactionType.INCOME}>收入</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
              <input 
                type="number"
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.accountId}
                onChange={e => setFormData({ ...formData, accountId: e.target.value })}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
              <input 
                type="date"
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">備註</label>
              <input 
                type="text"
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                placeholder="例如：晚餐、交通費"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              確認儲存
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">日期</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">分類</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">帳戶</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">備註</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">金額</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map(t => {
                  const account = accounts.find(a => a.id === t.accountId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{t.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <span className={`w-2 h-2 rounded-full ${account?.color || 'bg-slate-300'}`}></span>
                          {account?.name || '未知帳戶'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{t.note}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    目前沒有任何交易紀錄，快點新增一筆吧！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
