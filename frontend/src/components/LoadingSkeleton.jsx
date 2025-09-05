import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse ${className}`}
    >
      {type === 'card' && (
        <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
            <div className="w-20 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
          </div>
          <div className="w-32 h-8 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
          <div className="w-24 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
        </div>
      )}

      {type === 'chart' && (
        <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="w-40 h-6 bg-slate-300 dark:bg-slate-600 rounded mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="flex-1 h-8 bg-slate-300 dark:bg-slate-600 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'table' && (
        <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="w-48 h-6 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-200/50 dark:bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div>
                    <div className="w-24 h-4 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'text' && (
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
          <div className="w-3/4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
          <div className="w-1/2 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
        </div>
      )}
    </motion.div>
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-4">{skeletons}</div>;
};

export default LoadingSkeleton;
