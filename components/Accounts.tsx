
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountsProps {
  accounts: BankAccount[];
  onAdd: (acc: Omit<BankAccount, 'id' | 'userId'>) => void;
  onUpdate: (acc: BankAccount) => void;
  onDelete: (id: string) => void;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    balance: 0,
    color: 'bg-indigo-500'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      const original = accounts.find(a => a.id === editingId);
      if (original) {
        onUpdate({
          ...original,
          name: formData.name,
          balance: formData.balance,
          color: formData.color
        });
      }
      setEditingId(null);
    } else {
      onAdd(formData);
      setIsAdding(false);
    }
    
    setFormData({ name: '', balance: 0, color: 'bg-indigo-500' });
  };

  const startEdit = (acc: BankAccount) => {
    setEditingId(acc.id);
    setFormData({
      name: acc.name,
      balance: acc.balance,
      color: acc.color
    });
    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', balance: 0, color: 'bg-indigo-500' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">銀行帳戶管理</h2>
          <p className="text-slate-500">管理您的銀行存款、電子錢包與各項資產。</p>
        </div>
        <button 
          onClick={() => isAdding ? cancelForm() : setIsAdding(true)}
          className={`${isAdding ? 'bg-slate-200 text-slate-700' : 'bg-indigo-600 text-white shadow-md'} hover:opacity-90 px-6 py-2 rounded-xl font-bold transition-all active:scale-95`}
        >
          {isAdding ? '取消' : '＋ 新增帳戶'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-4 text-indigo-700">{editingId ? '編輯帳戶資料' : '建立新帳戶'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
              <input 
                type="text"
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="例如：國泰世華、數位帳戶"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">餘額 (不可直接編輯，請透過收支記錄調整)</label>
              <input 
                type="number"
                className="w-full p-3 bg-slate-200 rounded-xl border-none cursor-not-allowed"
                value={formData.balance}
                readOnly
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">色彩標籤</label>
              <div className="flex gap-2 p-2 bg-slate-50 rounded-xl">
                {['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-purple-500'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`w-8 h-8 rounded-full ${c} ${formData.color === c ? 'ring-4 ring-indigo-200 border-2 border-white' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={cancelForm}
              className="px-6 py-3 text-slate-500 font-medium"
            >
              取消
            </button>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              {editingId ? '儲存修改' : '確認建立'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${acc.color}`}></div>
            <div className="flex justify-between items-start mb-4 pl-2">
              <h3 className="font-bold text-lg text-slate-800">{acc.name}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => startEdit(acc)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="編輯"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDelete(acc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="刪除"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="pl-2">
              <p className="text-sm text-slate-400 font-medium">可用餘額</p>
              <p className="text-3xl font-bold text-slate-800">${acc.balance.toLocaleString()}</p>
            </div>
          </div>
        ))}
        {accounts.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-400 mb-4">目前還沒有設定任何帳戶</p>
             <button 
                onClick={() => setIsAdding(true)}
                className="text-indigo-600 font-bold hover:underline"
              >
                立即建立第一個帳戶
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
