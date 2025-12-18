
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, TransactionType } from "../types";

// 使用 gemini-3-pro-preview 進行複雜的財務分析
export const getFinancialAdvice = async (transactions: Transaction[], accounts: BankAccount[]) => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY
  if (!process.env.API_KEY) {
    return "【展示模式】目前未設定 API_KEY，無法連結 AI 顧問。請在 GitHub Secrets 中配置 API_KEY 以啟用完整分析。";
  }

  try {
    // Initialization must use a named parameter and process.env.API_KEY directly
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

    // Always use ai.models.generateContent to query GenAI with both the model name and prompt
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // Directly access the .text property (do not call as a method)
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "AI 顧問暫時無法連線，請稍後再試。";
  }
};

// 使用 gemini-3-flash-preview 進行簡單的運勢預測
export const getDailyFortune = async (userName: string) => {
  if (!process.env.API_KEY) return "今日運勢：財源滾滾 (展示模式)";

  try {
    // Initialization must use a named parameter and process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位幽默的財富命理大師。請為使用者「${userName}」算出今日財運運勢（大吉到末吉）、財位方位與幸運色。請使用繁體中文。`,
    });
    // Directly access the .text property
    return response.text;
  } catch (error) {
    console.error("Daily Fortune Error:", error);
    return "命運之輪暫時停止轉動...";
  }
};
