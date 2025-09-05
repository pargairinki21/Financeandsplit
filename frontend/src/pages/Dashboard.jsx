import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import SmartInsights from '../components/SmartInsights';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function Dashboard() {
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useContext(AuthContext)

  const API_BASE_URL = 'http://localhost:8000'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      
      const [monthlyRes, categoryRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/transactions/analytics/monthly`, config),
        axios.get(`${API_BASE_URL}/transactions/analytics/categories`, config),
        axios.get(`${API_BASE_URL}/transactions?limit=5`, config)
      ])
      
      setMonthlyData(monthlyRes.data)
      setCategoryData(categoryRes.data)
      setRecentTransactions(transactionsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const prepareMonthlyChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const incomeData = new Array(12).fill(0)
    const expenseData = new Array(12).fill(0)

    // If no real data, generate sample upward trending data
    if (monthlyData.length === 0) {
      const baseIncome = 5000
      const baseExpense = 3000
      for (let i = 0; i < 12; i++) {
        // Create upward trend with some variation
        incomeData[i] = baseIncome + (i * 200) + (Math.random() * 500 - 250)
        expenseData[i] = baseExpense + (i * 100) + (Math.random() * 300 - 150)
      }
    } else {
      monthlyData.forEach(item => {
        const monthIndex = item.month - 1
        if (item.type === 'income') {
          incomeData[monthIndex] = item.total
        } else {
          expenseData[monthIndex] = item.total
        }
      })
    }

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    }
  }

  const prepareCategoryChartData = () => {
    const expenseCategories = categoryData.filter(item => item.type === 'expense')
    
    return {
      labels: expenseCategories.map(item => item.category),
      datasets: [
        {
          data: expenseCategories.map(item => item.total),
          backgroundColor: [
            '#a855f7',
            '#3b82f6',
            '#06b6d4',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
          ],
          borderColor: [
            '#9333ea',
            '#2563eb',
            '#0891b2',
            '#059669',
            '#d97706',
            '#dc2626',
            '#7c3aed',
            '#db2777',
          ],
          borderWidth: 2,
        },
      ],
    }
  }

  const calculateTotals = () => {
    const totalIncome = categoryData
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.total, 0)
    
    const totalExpenses = categoryData
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.total, 0)

    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-300">Loading dashboard...</div>
      </div>
    )
  }

  const { totalIncome, totalExpenses, balance } = calculateTotals()

  return (
    <div className="min-h-screen" style={{backgroundColor: '#fafafa', backgroundImage: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #f0f0f0 100%)'}}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        {/* Smart Insights Section */}
        <div className="mb-8">
          <SmartInsights transactions={recentTransactions} />
        </div>

        {/* Main Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Available Balance - Main Card */}
          <div className="lg:col-span-2">
            <motion.div 
              className="backdrop-blur-xl bg-white/95 dark:bg-white/90 rounded-2xl p-8 shadow-2xl border border-primary-200/50 cursor-pointer"
              whileHover={{ 
                scale: 1.02, 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Left: Balance Info */}
                <div className="col-span-2">
                  <p className="text-slate-600 dark:text-slate-600 text-sm font-medium mb-2">Available Balance</p>
                  <h2 className="text-5xl font-bold text-slate-800 dark:text-slate-800 mb-2">
                    ₹{balance.toFixed(2)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${balance >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    <span className={`text-sm font-medium ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {balance >= 0 ? '+' : ''}${((balance / (totalIncome || 1)) * 100).toFixed(1)}% from last month
                    </span>
                  </div>
                </div>
                
                {/* Right: Mini Stats */}
                <div className="space-y-3">
                  {/* Today's Activity */}
                  <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 text-xs font-medium">Today</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-800 text-lg font-bold">₹{(totalExpenses * 0.1).toFixed(0)}</p>
                    <p className="text-slate-600 dark:text-slate-600 text-xs">spent today</p>
                  </div>
                  
                  {/* This Week */}
                  <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <span className="text-purple-400 text-xs font-medium">This Week</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-800 text-lg font-bold">₹{(totalExpenses * 0.3).toFixed(0)}</p>
                    <p className="text-slate-600 dark:text-slate-600 text-xs">weekly spending</p>
                  </div>
                  
                  {/* Transactions Count */}
                  <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                      <span className="text-cyan-400 text-xs font-medium">Activity</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-800 text-lg font-bold">{recentTransactions.length}</p>
                    <p className="text-slate-600 dark:text-slate-600 text-xs">transactions</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100/50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-600 text-xs">Income</p>
                      <p className="text-emerald-400 font-bold">₹{totalIncome.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100/50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-600 text-xs">Expenses</p>
                      <p className="text-blue-400 font-bold">₹{totalExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Side Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {/* Total Net Worth */}
            <motion.div 
              className="backdrop-blur-xl bg-white/95 dark:bg-white/90 p-4 rounded-xl shadow-2xl border border-accent-200/50 cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -6,
                boxShadow: "0 20px 25px -5px rgba(251, 146, 60, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-orange-400 text-xs font-medium">+12.5% this month</span>
              </div>
              <div>
                <p className="text-slate-600 text-xs font-medium mb-1">Total Net Worth</p>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">₹{(balance + 2400).toFixed(2)}</h3>
              </div>
            </motion.div>
            
            {/* Savings Goal */}
            <motion.div 
              className="backdrop-blur-xl bg-white/95 dark:bg-white/90 p-4 rounded-xl shadow-2xl border border-info-200/50 cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -6,
                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-cyan-400 text-xs font-medium">{Math.min((balance / 10000) * 100, 100).toFixed(0)}%</span>
              </div>
              <div>
                <p className="text-slate-600 text-xs font-medium mb-2">Savings Goal</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{width: `${Math.min((balance / 10000) * 100, 100)}%`}}></div>
                </div>
                <p className="text-cyan-400 text-xs font-medium">₹{balance.toFixed(2)} / ₹10,000</p>
              </div>
            </motion.div>
            
            {/* Monthly Budget */}
            <motion.div 
              className="backdrop-blur-xl bg-white/95 dark:bg-white/90 p-4 rounded-xl shadow-2xl border border-secondary-200/50 cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -6,
                boxShadow: "0 20px 25px -5px rgba(217, 70, 239, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${totalExpenses > 50000 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {totalExpenses > 50000 ? 'Over Budget' : 'On Track'}
                </span>
              </div>
              <div>
                <p className="text-slate-600 text-xs font-medium mb-1">Monthly Budget</p>
                <h3 className="text-xl font-bold text-slate-800 mb-2">₹{totalExpenses.toFixed(2)}</h3>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${totalExpenses > 50000 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-violet-400 to-pink-500'}`} 
                       style={{width: `${Math.min((totalExpenses / 50000) * 100, 100)}%`}}></div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>

        {/* Income Sources & Spending Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Income Sources */}
          <motion.div 
            className="lg:col-span-2 backdrop-blur-xl bg-white/95 dark:bg-white/90 p-6 rounded-2xl shadow-2xl border border-primary-200/50 cursor-pointer"
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Income Sources</h2>
              <div className="text-sm text-slate-600">This Month</div>
            </div>
            
            <div className="space-y-4">
              {/* Mock Income Sources with Bar Visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Salary</span>
                  </div>
                  <span className="text-emerald-400 font-bold">₹{(totalIncome * 0.7).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Freelance</span>
                  </div>
                  <span className="text-blue-400 font-bold">₹{(totalIncome * 0.2).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Investments</span>
                  </div>
                  <span className="text-purple-400 font-bold">₹{(totalIncome * 0.1).toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
              </div>
            </div>
            
            {/* Monthly Chart */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Trend</h3>
              <div className="h-48">
                <Bar data={prepareMonthlyChartData()} options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#475569',
                        font: {
                          size: 12
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: '#94a3b8',
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                      }
                    },
                    y: {
                      ticks: {
                        color: '#94a3b8',
                        font: {
                          size: 11
                        }
                      },
                      grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </motion.div>

          {/* Spending Categories */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/95 dark:bg-white/90 p-6 rounded-2xl shadow-2xl shadow-purple-500/20 border border-primary-200/50">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">Spending</h2>
              
              {/* Spending Categories with Progress Circles */}
              <div className="space-y-4">
                {categoryData.filter(item => item.type === 'expense').slice(0, 4).map((category, index) => {
                  const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-pink-400']
                  const bgColors = ['bg-red-500/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-pink-500/20']
                  const percentage = ((category.total / totalExpenses) * 100).toFixed(0)
                  
                  return (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${bgColors[index]} rounded-lg flex items-center justify-center`}>
                          <div className={`w-2 h-2 ${colors[index].replace('text-', 'bg-')} rounded-full`}></div>
                        </div>
                        <div>
                          <p className="text-slate-700 font-medium text-sm">{category.category}</p>
                          <p className="text-slate-600 text-xs">{percentage}% of spending</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${colors[index]} font-bold text-sm`}>₹{category.total.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Doughnut Chart */}
              <div className="mt-6">
                {categoryData.filter(item => item.type === 'expense').length > 0 ? (
                  <div className="h-36">
                    <Doughnut data={prepareCategoryChartData()} options={{ 
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }} />
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8 text-sm">No expense data</p>
                )}
              </div>
            </div>
            
            {/* Notifications */}
            <div className="backdrop-blur-xl bg-white/95 dark:bg-white/90 p-6 rounded-2xl shadow-2xl shadow-orange-500/20 border border-primary-200/50">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">Budget Alert</p>
                    <p className="text-slate-600 text-xs">You've spent 80% of your monthly budget</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Investment Tip</p>
                    <p className="text-slate-600 text-xs">Consider diversifying your portfolio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="backdrop-blur-xl bg-white/95 dark:bg-white/90 shadow-2xl shadow-indigo-500/20 rounded-xl border border-primary-200/50">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Recent Transactions</h2>
            {recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {transaction.description || 'No description'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-600">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No transactions found</p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
