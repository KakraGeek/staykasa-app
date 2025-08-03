const fs = require('fs');
const path = require('path');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // Path to the database file
    const dbPath = path.join(__dirname, 'prisma', 'dev.db');
    
    // Check if database file exists
    if (fs.existsSync(dbPath)) {
      console.log('🗑️  Deleting existing database...');
      fs.unlinkSync(dbPath);
      console.log('✅ Database file deleted');
    } else {
      console.log('ℹ️  No existing database file found');
    }
    
    console.log('🌱 Running database migrations...');
    
    // Run migrations to recreate the database
    const { execSync } = require('child_process');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    
    console.log('✅ Database reset complete!');
    console.log('🎉 You can now test booking with fresh dates!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    console.log('💡 Try running these commands manually:');
    console.log('   npx prisma migrate reset --force');
    console.log('   npx prisma db seed');
  }
}

resetDatabase(); 