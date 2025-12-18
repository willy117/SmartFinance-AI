
import { BankAccount, Transaction, User, TransactionType, Category } from '../types';

const USERS_KEY = 'sf_users';
const ACCOUNTS_KEY = 'sf_accounts';
const TRANSACTIONS_KEY = 'sf_transactions';
const CURRENT_USER_KEY = 'sf_current_user';

export const storageService = {
  // User Operations
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Account Operations
  getAccounts: (userId: string): BankAccount[] => {
    const all = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    const userAccounts = all.filter((a: BankAccount) => a.userId === userId);
    if (userAccounts.length === 0) {
      const defaults = [
        { id: 'acc1', name: '現金錢包', balance: 5000, color: 'bg-emerald-500', userId },
        { id: 'acc2', name: '主要銀行帳戶', balance: 45000, color: 'bg-blue-500', userId }
      ];
      const otherUserAccounts = all.filter((a: BankAccount) => a.userId !== userId);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...otherUserAccounts, ...defaults]));
      return defaults;
    }
    return userAccounts;
  },

  saveAccounts: (accounts: BankAccount[]) => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  addAccount: (account: BankAccount) => {
    const all = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    all.push(account);
    storageService.saveAccounts(all);
  },

  updateAccount: (account: BankAccount) => {
    const all = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    const index = all.findIndex((a: BankAccount) => a.id === account.id);
    if (index !== -1) {
      all[index] = account;
      storageService.saveAccounts(all);
    }
  },

  deleteAccount: (id: string) => {
    const all = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    const filtered = all.filter((a: BankAccount) => a.id !== id);
    storageService.saveAccounts(filtered);
    
    // Also delete transactions for this account
    const allTrans = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
    const filteredTrans = allTrans.filter((t: Transaction) => t.accountId !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTrans));
  },

  // Transaction Operations
  getTransactions: (userId: string): Transaction[] => {
    const all = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
    const userTrans = all.filter((t: Transaction) => t.userId === userId);
    if (userTrans.length === 0) {
      const defaults: Transaction[] = [
        { id: 't1', accountId: 'acc2', userId, type: TransactionType.INCOME, category: Category.SALARY, amount: 60000, date: new Date().toISOString().split('T')[0], note: '本月薪資' },
        { id: 't2', accountId: 'acc1', userId, type: TransactionType.EXPENSE, category: Category.FOOD, amount: 120, date: new Date().toISOString().split('T')[0], note: '午餐' },
        { id: 't3', accountId: 'acc2', userId, type: TransactionType.EXPENSE, category: Category.HOUSING, amount: 15000, date: new Date().toISOString().split('T')[0], note: '房租' },
        { id: 't4', accountId: 'acc1', userId, type: TransactionType.EXPENSE, category: Category.TRANSPORT, amount: 50, date: new Date().toISOString().split('T')[0], note: '公車' }
      ];
      const otherTrans = all.filter((t: Transaction) => t.userId !== userId);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([...otherTrans, ...defaults]));
      return defaults;
    }
    return userTrans;
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction) => {
    const all = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
    all.push(transaction);
    storageService.saveTransactions(all);
    
    // Update account balance
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    const account = accounts.find((a: BankAccount) => a.id === transaction.accountId);
    if (account) {
      if (transaction.type === TransactionType.INCOME) {
        account.balance += transaction.amount;
      } else {
        account.balance -= transaction.amount;
      }
      storageService.saveAccounts(accounts);
    }
  },

  deleteTransaction: (id: string) => {
    const all = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
    const trans = all.find((t: Transaction) => t.id === id);
    if (trans) {
      // Revert account balance
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
      const account = accounts.find((a: BankAccount) => a.id === trans.accountId);
      if (account) {
        if (trans.type === TransactionType.INCOME) {
          account.balance -= trans.amount;
        } else {
          account.balance += trans.amount;
        }
        storageService.saveAccounts(accounts);
      }
      const filtered = all.filter((t: Transaction) => t.id !== id);
      storageService.saveTransactions(filtered);
    }
  }
};
