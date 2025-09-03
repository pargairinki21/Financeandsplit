import React, { useState, useEffect } from 'react';

const SplitExpenses = () => {
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Load groups and expenses from localStorage
    const loadData = () => {
      const savedGroups = JSON.parse(localStorage.getItem('splitGroups') || '[]');
      const savedExpenses = JSON.parse(localStorage.getItem('splitExpenses') || '[]');
      
      setGroups(savedGroups);
      setExpenses(savedExpenses);
      
      // Calculate individual balances
      const balanceMap = new Map();
      
      savedExpenses.forEach(expense => {
        const group = savedGroups.find(g => g.id == expense.groupId);
        if (!group) return;
        
        const payer = expense.paidBy;
        const splitAmount = expense.splitAmount;
        
        group.members.forEach(member => {
          if (member !== payer) {
            const key = `${member}-${payer}`;
            const reverseKey = `${payer}-${member}`;
            
            if (balanceMap.has(reverseKey)) {
              const existing = balanceMap.get(reverseKey);
              const newAmount = existing.amount - splitAmount;
              if (newAmount > 0) {
                balanceMap.set(reverseKey, { ...existing, amount: newAmount });
              } else if (newAmount < 0) {
                balanceMap.delete(reverseKey);
                balanceMap.set(key, {
                  from: member,
                  to: payer,
                  amount: Math.abs(newAmount),
                  groupName: expense.groupName
                });
              } else {
                balanceMap.delete(reverseKey);
              }
            } else {
              const existing = balanceMap.get(key);
              balanceMap.set(key, {
                from: member,
                to: payer,
                amount: existing ? existing.amount + splitAmount : splitAmount,
                groupName: expense.groupName
              });
            }
          }
        });
      });
      
      setBalances(Array.from(balanceMap.values()));
    };

    loadData();

    // Listen for updates
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('groupsUpdated', handleUpdate);
    window.addEventListener('expensesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('groupsUpdated', handleUpdate);
      window.removeEventListener('expensesUpdated', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Split & Share</h2>
            <p className="text-slate-400 text-sm">Expense splitting made simple</p>
          </div>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Group</span>
        </button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Balance */}
        <div className="glass p-4 rounded-xl shadow-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-emerald-400 text-xs font-semibold">NET BALANCE</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">₹{(1250.50 - 890.25).toFixed(2)}</h3>
          <p className="text-emerald-400 text-sm">You are owed overall</p>
        </div>

        {/* Amount Owed */}
        <div className="glass p-4 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span className="text-blue-400 text-xs font-semibold">OWED TO YOU</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">₹1,250.50</h3>
          <p className="text-blue-400 text-sm">From 2 groups</p>
        </div>

        {/* Amount Owing */}
        <div className="glass p-4 rounded-xl shadow-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span className="text-orange-400 text-xs font-semibold">YOU OWE</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">₹890.25</h3>
          <p className="text-orange-400 text-sm">To 2 groups</p>
        </div>
      </div>

      {/* Groups & Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Groups */}
        <div className="glass p-6 rounded-2xl shadow-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Groups</h3>
            <span className="text-slate-400 text-sm">{groups.length} groups</span>
          </div>

          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{group.name}</h4>
                    <p className="text-slate-400 text-xs">{group.members.length} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-sm">+₹{group.totalOwed.toFixed(2)}</p>
                    <p className="text-orange-400 font-bold text-xs">-₹{group.totalOwing.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  {group.members.slice(0, 4).map((member, index) => (
                    <div key={index} className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{member.charAt(0)}</span>
                    </div>
                  ))}
                  {group.members.length > 4 && (
                    <span className="text-slate-400 text-xs">+{group.members.length - 4}</span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  Latest: {group.recentExpenses[0]?.description} - ₹{group.recentExpenses[0]?.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Balances */}
        <div className="glass p-6 rounded-2xl shadow-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Individual Balances</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Settle All
            </button>
          </div>

          <div className="space-y-3">
            {balances.map((balance, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:bg-slate-800/60 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{balance.from.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {balance.from === 'You' ? `${balance.to} owes you` : `You owe ${balance.to}`}
                    </p>
                    <p className="text-slate-400 text-xs">{balance.groupName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${balance.from === 'You' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {balance.from === 'You' ? '+' : '-'}₹{balance.amount.toFixed(2)}
                  </p>
                  <button className="text-purple-400 hover:text-purple-300 text-xs">
                    {balance.from === 'You' ? 'Remind' : 'Settle'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Split Expenses */}
      <div className="glass p-6 rounded-2xl shadow-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Split Expenses</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">No expenses yet</p>
              <p className="text-slate-500 text-xs mt-1">Split your first expense to see it here</p>
            </div>
          ) : (
            expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:bg-slate-800/60 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{expense.description}</p>
                    <p className="text-slate-400 text-xs">Paid by {expense.paidBy} • {expense.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">₹{expense.amount.toFixed(2)}</p>
                  <p className="text-purple-400 text-xs">Split {expense.members.length} ways</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitExpenses;
