
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  orderBy 
} from "firebase/firestore";
import { db, isConfigured } from "./firebase";
import { BankAccount, Transaction } from "../types";

export const dbService = {
  async getAccounts(userId: string, isDemo: boolean): Promise<BankAccount[]> {
    // 型別守衛：檢查是否應使用展示模式或 Firebase 是否未正確初始化
    if (isDemo || !isConfigured || !db) {
      const all = JSON.parse(localStorage.getItem('sf_accounts') || '[]');
      const userAccounts = all.filter((a: any) => a.userId === userId);
      if (userAccounts.length === 0) {
        const defaults = [
          { id: 'demo-acc-1', name: '現金錢包 (測試)', balance: 5000, color: 'bg-emerald-500', userId },
          { id: 'demo-acc-2', name: '銀行帳戶 (測試)', balance: 45000, color: 'bg-blue-500', userId }
        ];
        localStorage.setItem('sf_accounts', JSON.stringify([...all, ...defaults]));
        return defaults;
      }
      return userAccounts;
    }

    // 正式模式：使用非空斷言或型別守衛後的 db
    const q = query(collection(db!, "accounts"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BankAccount));
  },

  async addAccount(account: Omit<BankAccount, "id">, isDemo: boolean): Promise<string> {
    if (isDemo || !isConfigured || !db) {
      const all = JSON.parse(localStorage.getItem('sf_accounts') || '[]');
      const id = 'local-' + Math.random().toString(36).substr(2, 9);
      all.push({ ...account, id });
      localStorage.setItem('sf_accounts', JSON.stringify(all));
      return id;
    }
    const docRef = await addDoc(collection(db!, "accounts"), account);
    return docRef.id;
  },

  async deleteAccount(accountId: string, isDemo: boolean) {
    if (isDemo || !isConfigured || !db) {
      const all = JSON.parse(localStorage.getItem('sf_accounts') || '[]');
      localStorage.setItem('sf_accounts', JSON.stringify(all.filter((a: any) => a.id !== accountId)));
      return;
    }
    await deleteDoc(doc(db!, "accounts", accountId));
  },

  async getTransactions(userId: string, isDemo: boolean): Promise<Transaction[]> {
    if (isDemo || !isConfigured || !db) {
      const all = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
      return all.filter((t: any) => t.userId === userId).sort((a: any, b: any) => b.date.localeCompare(a.date));
    }
    const q = query(
      collection(db!, "transactions"), 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
  },

  async addTransaction(transaction: Omit<Transaction, "id">, isDemo: boolean) {
    if (isDemo || !isConfigured || !db) {
      const all = JSON.parse(localStorage.getItem('sf_transactions') || '[]');
      const id = 'local-' + Math.random().toString(36).substr(2, 9);
      all.push({ ...transaction, id });
      localStorage.setItem('sf_transactions', JSON.stringify(all));
      return;
    }
    await addDoc(collection(db!, "transactions"), transaction);
  }
};
