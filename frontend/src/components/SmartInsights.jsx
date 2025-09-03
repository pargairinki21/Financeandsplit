import React, { useState, useEffect } from 'react';

const SmartInsights = ({ transactions }) => {
  const [insights, setInsights] = useState([]);
  const [financialScore, setFinancialScore] = useState(0);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    if (transactions.length > 0) {
      generateInsights();
      calculateFinancialScore();
    }
  }, [transactions]);

  const generateInsights = () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    
    // Analyze spending patterns
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    // Weekend vs weekday analysis
    const weekendSpending = transactions
      .filter(t => {
        const date = new Date(t.date);
        const day = date.getDay();
        return (day === 0 || day === 6) && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const weekdaySpending = totalExpenses - weekendSpending;
    const weekendPercentage = totalExpenses > 0 ? (weekendSpending / totalExpenses * 100) : 0;

    const newInsights = [
      {
        id: 1,
        type: 'savings',
        icon: '💰',
        title: 'Savings Rate Analysis',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income!`,
        subtext: savingsRate > 20 ? 'Excellent savings habit!' : savingsRate > 10 ? 'Good progress, aim for 20%+' : 'Consider increasing your savings rate',
        color: savingsRate > 20 ? 'text-emerald-400' : savingsRate > 10 ? 'text-yellow-400' : 'text-red-400',
        bgColor: savingsRate > 20 ? 'bg-emerald-500/20' : savingsRate > 10 ? 'bg-yellow-500/20' : 'bg-red-500/20',
        progress: Math.min(savingsRate, 100)
      },
      {
        id: 2,
        type: 'spending',
        icon: '🛍️',
        title: 'Top Spending Category',
        message: topCategory ? `${topCategory[0]} is your biggest expense` : 'No expenses tracked yet',
        subtext: topCategory ? `₹${topCategory[1].toFixed(2)} spent this period` : '',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        progress: topCategory ? (topCategory[1] / totalExpenses * 100) : 0
      },
      {
        id: 3,
        type: 'pattern',
        icon: '📅',
        title: 'Weekend Spending Pattern',
        message: `${weekendPercentage.toFixed(1)}% of spending happens on weekends`,
        subtext: weekendPercentage > 40 ? 'You love weekend treats!' : weekendPercentage > 25 ? 'Balanced spending pattern' : 'Weekday spender detected!',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        progress: weekendPercentage
      }
    ];

    setInsights(newInsights);
  };

  const calculateFinancialScore = () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    let score = 50; // Base score
    
    // Savings rate impact (40 points max)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    score += Math.min(savingsRate * 2, 40);
    
    // Transaction consistency (10 points max)
    if (transactions.length > 10) score += 10;
    else if (transactions.length > 5) score += 5;
    
    const finalScore = Math.min(Math.round(score), 100);
    
    // Animate score change
    setAnimateScore(true);
    setTimeout(() => {
      setFinancialScore(finalScore);
      setTimeout(() => setAnimateScore(false), 1000);
    }, 500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (transactions.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl shadow-2xl">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Insights Coming Soon!</h3>
          <p className="text-slate-400">Add some transactions to unlock smart financial insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Financial Health Score - Compact */}
      <div className="glass p-3 rounded-xl shadow-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <h3 className="text-xs font-semibold text-emerald-400">Health Score</h3>
          </div>
        </div>

        {/* Compact Score Display */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-2">
            {/* Background Circle */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-700"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="url(#healthGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - financialScore / 100)}`}
                className="transition-all duration-2000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white">{financialScore}</span>
            </div>
          </div>
          
          {/* Status Message */}
          <div className="space-y-1">
            <p className={`font-semibold text-sm ${
              financialScore >= 80 ? 'text-emerald-400' : 
              financialScore >= 60 ? 'text-yellow-400' : 
              'text-orange-400'
            }`}>
              {financialScore >= 80 ? 'Excellent!' : financialScore >= 60 ? 'Good!' : 'Keep Going!'}
            </p>
            <p className="text-slate-400 text-xs">
              {financialScore >= 80 ? 'You\'re a financial rockstar!' : financialScore >= 60 ? 'You\'re on the right track!' : 'Small steps lead to big wins!'}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Insights - Compact */}
      <div className="lg:col-span-3 glass p-3 rounded-xl shadow-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Financial Intelligence</h3>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2 hover:bg-slate-800/60 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.4s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${insight.bgColor.replace('/20', '/30')}`}>
                    <span className="text-xs">{insight.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs">{insight.title}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${insight.color} font-bold text-sm`}>{insight.progress.toFixed(1)}%</p>
                </div>
              </div>
              
              <p className={`${insight.color} font-medium text-xs mb-2`}>{insight.message}</p>
              
              {/* Compact Progress Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    background: insight.color.includes('emerald') ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' :
                               insight.color.includes('blue') ? 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' :
                               insight.color.includes('purple') ? 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)' :
                               'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)',
                    width: `${insight.progress}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Recommendation */}
        <div className="mt-3 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-400 text-xs mb-1">Tip</h4>
              <p className="text-slate-300 text-xs">
                Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
