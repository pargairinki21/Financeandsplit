import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import SplitExpenses from '../components/SplitExpenses';

const Groups = () => {
  const { token } = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState(['']);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('you');

  useEffect(() => {
    // Load groups from localStorage
    const loadGroups = () => {
      const savedGroups = JSON.parse(localStorage.getItem('splitGroups') || '[]');
      setGroups(savedGroups);
    };

    loadGroups();

    // Listen for group updates
    const handleGroupsUpdate = () => {
      loadGroups();
    };

    window.addEventListener('groupsUpdated', handleGroupsUpdate);
    
    return () => {
      window.removeEventListener('groupsUpdated', handleGroupsUpdate);
    };
  }, []);

  const addMemberField = () => {
    setNewGroupMembers([...newGroupMembers, '']);
  };

  const updateMember = (index, value) => {
    const updated = [...newGroupMembers];
    updated[index] = value;
    setNewGroupMembers(updated);
  };

  const removeMember = (index) => {
    if (newGroupMembers.length > 1) {
      const updated = newGroupMembers.filter((_, i) => i !== index);
      setNewGroupMembers(updated);
    }
  };

  const handleCreateGroup = () => {
    const filteredMembers = newGroupMembers.filter(m => m.trim());
    if (!newGroupName.trim() || filteredMembers.length === 0) {
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: newGroupName.trim(),
      members: ['You', ...filteredMembers],
      totalOwed: 0,
      totalOwing: 0,
      recentExpenses: []
    };

    // Add to SplitExpenses component state (we'll need to pass this down)
    console.log('Creating group:', newGroup);
    
    // For now, we'll store in localStorage until backend is ready
    const existingGroups = JSON.parse(localStorage.getItem('splitGroups') || '[]');
    existingGroups.push(newGroup);
    localStorage.setItem('splitGroups', JSON.stringify(existingGroups));
    
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupMembers(['']);
    
    // Force re-render by triggering a custom event
    window.dispatchEvent(new CustomEvent('groupsUpdated'));
  };

  const handleSplitExpense = () => {
    if (!selectedGroup || !expenseDescription.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0) {
      return;
    }

    const group = groups.find(g => g.id == selectedGroup);
    if (!group) return;

    const amount = parseFloat(expenseAmount);
    const splitAmount = amount / group.members.length;

    // Create new expense
    const newExpense = {
      id: Date.now(),
      groupId: selectedGroup,
      groupName: group.name,
      description: expenseDescription.trim(),
      amount: amount,
      paidBy: paidBy === 'you' ? 'You' : paidBy,
      splitAmount: splitAmount,
      date: new Date().toISOString().split('T')[0],
      members: group.members
    };

    // Save expense to localStorage
    const existingExpenses = JSON.parse(localStorage.getItem('splitExpenses') || '[]');
    existingExpenses.push(newExpense);
    localStorage.setItem('splitExpenses', JSON.stringify(existingExpenses));

    // Update group balances
    const updatedGroups = groups.map(g => {
      if (g.id == selectedGroup) {
        const payer = paidBy === 'you' ? 'You' : paidBy;
        const owedAmount = splitAmount * (group.members.length - 1);
        
        return {
          ...g,
          totalOwed: payer === 'You' ? g.totalOwed + owedAmount : g.totalOwed,
          totalOwing: payer !== 'You' ? g.totalOwing + splitAmount : g.totalOwing,
          recentExpenses: [...(g.recentExpenses || []), newExpense]
        };
      }
      return g;
    });

    localStorage.setItem('splitGroups', JSON.stringify(updatedGroups));

    // Reset form and close modal
    setSelectedGroup('');
    setExpenseDescription('');
    setExpenseAmount('');
    setPaidBy('you');
    setShowSplitModal(false);

    // Trigger updates
    window.dispatchEvent(new CustomEvent('groupsUpdated'));
    window.dispatchEvent(new CustomEvent('expensesUpdated'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Groups & Split Expenses</h1>
            <p className="text-slate-400">Manage shared expenses with friends and roommates</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSplitModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Split Expense</span>
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Split Expenses Component */}
        <SplitExpenses />

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create New Group</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Group Name / Apartment Address</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Apartment 4B, 123 Main Street, Weekend Trip"
                    className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </div>

                {/* Members */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Members</label>
                  <div className="space-y-2">
                    {newGroupMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => updateMember(index, e.target.value)}
                          placeholder="Member name or email"
                          className="flex-1 p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                        {newGroupMembers.length > 1 && (
                          <button
                            onClick={() => removeMember(index)}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addMemberField}
                      className="w-full p-3 border-2 border-dashed border-slate-600/50 rounded-lg text-slate-400 hover:text-white hover:border-purple-500/50 transition-all flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim() || newGroupMembers.filter(m => m.trim()).length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Split Expense Modal */}
        {showSplitModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Split New Expense</h3>
                <button 
                  onClick={() => setShowSplitModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select Group</label>
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  >
                    <option value="">Choose a group...</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expense Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <input
                      type="text"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      placeholder="e.g., Groceries, Dinner"
                      className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="₹0.00"
                      className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Split Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Split Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium hover:bg-purple-500/30 transition-all">
                      Equal
                    </button>
                    <button className="p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-400 font-medium hover:bg-slate-700/50 transition-all">
                      Percentage
                    </button>
                    <button className="p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-400 font-medium hover:bg-slate-700/50 transition-all">
                      Custom
                    </button>
                  </div>
                </div>

                {/* Paid By */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Paid By</label>
                  <select 
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  >
                    <option value="you">You</option>
                    {selectedGroup && groups.find(g => g.id == selectedGroup)?.members
                      .filter(member => member !== 'You')
                      .map((member, index) => (
                        <option key={index} value={member.toLowerCase()}>
                          {member}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSplitModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSplitExpense}
                    disabled={!selectedGroup || !expenseDescription.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                  >
                    Split Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;
