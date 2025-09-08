#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Starting custom build process...');
  
  // Try to set executable permissions for vite (Linux/Unix)
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    try {
      execSync(`chmod +x "${vitePath}"`, { stdio: 'pipe' });
      console.log('Set executable permissions for vite');
    } catch (chmodError) {
      console.log('chmod failed, continuing with npx...');
    }
  }
  
  // Use npx to run vite build (bypasses permission issues)
  console.log('Running vite build via npx...');
  execSync('npx vite build --mode production', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
