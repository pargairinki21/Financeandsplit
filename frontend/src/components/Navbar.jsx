import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const { logout } = useContext(AuthContext)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-primary-200/30 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl font-bold">₹</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hidden sm:block">
                Finance Tracker
              </span>
              <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent sm:hidden">
                FT
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-info-500/20 text-info-600 border border-primary-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-info-600 hover:bg-primary-500/10'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/transactions') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-accent-600 border border-accent-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-accent-600 hover:bg-accent-500/10'
                }`}
              >
                Transactions
              </Link>
              <Link
                to="/groups"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/groups') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-600 border border-primary-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-primary-500/10'
                }`}
              >
                Groups
              </Link>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/20 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/20 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-all duration-200"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Hamburger Menu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl bg-white/20 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-primary-200/30 dark:border-slate-700/50"
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-info-500/20 text-info-600 border border-primary-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-info-600 hover:bg-primary-500/10'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/transactions') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-accent-600 border border-accent-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-accent-600 hover:bg-accent-500/10'
                }`}
              >
                Transactions
              </Link>
              <Link
                to="/groups"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/groups') 
                    ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-600 border border-primary-500/30' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 hover:bg-primary-500/10'
                }`}
              >
                Groups
              </Link>
              
              {/* Mobile Logout */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
