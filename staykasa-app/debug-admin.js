// Debug script to help identify the source of the "9 properties" issue
console.log('🔍 Debugging Admin Dashboard Issue');

// Check if there are any cached values
console.log('📊 Checking localStorage...');
const cachedStats = localStorage.getItem('dashboard-stats');
if (cachedStats) {
  console.log('Found cached stats:', JSON.parse(cachedStats));
} else {
  console.log('No cached stats found');
}

// Check sessionStorage
console.log('📊 Checking sessionStorage...');
const sessionStats = sessionStorage.getItem('dashboard-stats');
if (sessionStats) {
  console.log('Found session stats:', JSON.parse(sessionStats));
} else {
  console.log('No session stats found');
}

// Check if there are any other cached values
console.log('📊 Checking all localStorage keys...');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('property') || key.includes('dashboard')) {
    console.log(`Key: ${key}, Value:`, localStorage.getItem(key));
  }
}

// Check if there are any global variables that might contain property data
console.log('📊 Checking window object for property data...');
if (typeof window !== 'undefined') {
  for (const key in window) {
    if (key.includes('property') || key.includes('dashboard')) {
      console.log(`Window key: ${key}`, window[key]);
    }
  }
}

console.log('🔍 Debug complete'); 