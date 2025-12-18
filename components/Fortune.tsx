
import React, { useState } from 'react';
import { getDailyFortune } from '../services/geminiService';

interface FortuneProps {
  userName: string;
}

const Fortune: React.FC<FortuneProps> = ({ userName }) => {
  const [fortune, setFortune] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const drawFortune = async () => {
    setDrawing(true);
    setFortune(null);
    
    // Simulate drawing animation duration
    setTimeout(async () => {
      setLoading(true);
      const result = await getDailyFortune(userName);
      setFortune(result);
      setLoading(false);
      setDrawing(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">每日財富運勢</h2>
        <p className="text-slate-500">讓 AI 為您揭開今日的財運玄機，祝您財源廣進！</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col items-center relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-50 rounded-full opacity-50 blur-3xl"></div>

        {!fortune && !drawing && !loading && (
          <div className="py-20 flex flex-col items-center">
            <div className="text-8xl mb-8 animate-bounce">🔮</div>
            <button
              onClick={drawFortune}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              抽今日運勢
            </button>
            <p className="mt-4 text-slate-400 text-sm">每天限抽一次，獲取今日最佳財富啟示</p>
          </div>
        )}

        {drawing && (
          <div className="py-20 flex flex-col items-center">
            <div className="relative">
              <div className="text-8xl animate-spin duration-[2000ms]">🔮</div>
              <div className="absolute top-0 left-0 text-8xl animate-ping opacity-30">✨</div>
            </div>
            <p className="mt-8 text-indigo-600 font-bold text-xl animate-pulse">
              正在與財神爺通訊中...
            </p>
          </div>
        )}

        {loading && !drawing && (
          <div className="py-20 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500">正在編譯您的命運...</p>
          </div>
        )}

        {fortune && !loading && !drawing && (
          <div className="w-full animate-in fade-in zoom-in duration-500">
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8">
              <div className="flex justify-center mb-6">
                <span className="bg-amber-100 text-amber-800 px-6 py-2 rounded-full font-bold text-lg shadow-sm border border-amber-200">
                  今日運勢結果
                </span>
              </div>
              
              <div className="prose prose-indigo max-w-none text-slate-700">
                {fortune.split('\n').filter(l => l.trim()).map((line, i) => (
                  <p key={i} className="mb-4 text-lg leading-relaxed text-center font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setFortune(null)}
                className="text-slate-400 hover:text-indigo-600 font-medium transition-colors"
              >
                ← 重新抽取 (或明天再來)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">日期</div>
          <div className="text-sm font-semibold">{new Date().toLocaleDateString()}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-2xl mb-1">👤</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">福主</div>
          <div className="text-sm font-semibold">{userName}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-2xl mb-1">🧧</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">提醒</div>
          <div className="text-sm font-semibold">量入為出</div>
        </div>
      </div>
    </div>
  );
};

export default Fortune;
