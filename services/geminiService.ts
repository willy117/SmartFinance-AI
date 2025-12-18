
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, TransactionType } from "../types";

// Function to get financial advice using gemini-3-pro-preview
export const getFinancialAdvice = async (transactions: Transaction[], accounts: BankAccount[]) => {
  try {
    // Always use named parameter for apiKey and use process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const summary = transactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) acc.income += t.amount;
      else acc.expense += t.amount;
      acc.categories[t.category] = (acc.categories[t.category] || 0) + t.amount;
      return acc;
    }, { income: 0, expense: 0, categories: {} as Record<string, number> });

    const prompt = `
      作為一個專業的理財顧問，請深度分析以下使用者的財務數據並提供具體洞察。
      
      總資產：${accounts.reduce((sum, a) => sum + (a.balance || 0), 0)} 元
      本期總收入：${summary.income} 元
      本期總支出：${summary.expense} 元
      支出分類統計：${JSON.stringify(summary.categories)}
      
      請針對使用者的收支健康度、潛在開銷風險給予專業建議。
      請使用繁體中文，語氣需精準且具有權威感。
    `;

    // Use gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // Access the text property directly (not a method)
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "理財建議生成失敗，請確認您的 API 配額或網路狀態。";
  }
};

// Function to get daily fortune using gemini-3-flash-preview
export const getDailyFortune = async (userName: string) => {
  try {
    // Re-initialize with latest API key from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位幽默的財富命理大師。請為使用者「${userName}」算出今日財運運勢（大吉到末吉）、財位方位與幸運色。請使用繁體中文。`,
    });
    // Access the text property directly
    return response.text;
  } catch (error) {
    console.error("Daily Fortune Error:", error);
    return "命運之輪暫時停止轉動...";
  }
};
