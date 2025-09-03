import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

function Transactions() {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_BASE_URL = 'http://localhost:8000'

  useEffect(() => {
    fetchTransactions()
  }, [token])

  const fetchTransactions = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setTransactions(response.data)
      setError('')
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Get fresh token from localStorage
    const currentToken = token || localStorage.getItem('token')
    
    if (!currentToken) {
      setError('Please log in to add transactions')
      return
    }
    
    console.log('Submitting with token:', currentToken ? 'Token exists' : 'No token')
    
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      }
      
      console.log('Request config:', config)
      console.log('Form data:', formData)
      
      if (editingTransaction) {
        await axios.put(`${API_BASE_URL}/transactions/${editingTransaction.id}`, formData, config)
      } else {
        const response = await axios.post(`${API_BASE_URL}/transactions/`, formData, config)
        console.log('Transaction created:', response.data)
      }
      
      setFormData({ amount: '', category: '', type: 'expense', description: '' })
      setShowForm(false)
      setEditingTransaction(null)
      fetchTransactions()
    } catch (error) {
      console.error('Error saving transaction:', error)
      console.error('Error response:', error.response)
      setError(error.response?.data?.detail || 'Failed to save transaction')
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      description: transaction.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!token) {
      setError('Please log in to delete transactions')
      return
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      setError('Failed to delete transaction')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const resetForm = () => {
    setFormData({ amount: '', category: '', type: 'expense', description: '' })
    setShowForm(false)
    setEditingTransaction(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-300">Loading transactions...</div>
      </div>
    )
  }

  // Debug token status
  const currentToken = token || localStorage.getItem('token')
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <div className="flex items-center space-x-4">
            {/* Debug info */}
            <div className="text-xs text-slate-400">
              Token: {currentToken ? 'Available' : 'Missing'}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-purple hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            {error.includes('401') && (
              <p className="text-yellow-400 text-xs mt-2">
                💡 Your session may have expired. Please <a href="/" className="underline">login again</a>.
              </p>
            )}
          </div>
        )}

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
            <div className="relative top-20 mx-auto p-6 w-96 max-w-md">
              <div className="glass rounded-2xl shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <input
                        type="text"
                        name="category"
                        required
                        className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Food, Transportation, Salary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                      <select
                        name="type"
                        className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="w-full px-4 py-3 bg-dark-100 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Optional description"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 text-sm font-medium text-slate-300 bg-dark-100 hover:bg-slate-600 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-purple hover:opacity-90 rounded-lg transition-all shadow-lg"
                      >
                        {editingTransaction ? 'Update' : 'Add'} Transaction
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="glass shadow-2xl rounded-xl overflow-hidden">
          {transactions.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-600">
              <thead className="bg-dark-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-dark-100/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {transaction.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-blue-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-all"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-all"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 bg-gradient-purple rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-slate-300 text-lg font-medium">No transactions found</p>
              <p className="text-slate-400 text-sm mt-2">Add your first transaction to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transactions
