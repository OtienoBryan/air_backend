const os = require('os');
const process = require('process');

function getPerformanceMetrics() {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    uptime: process.uptime(),
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB',
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + ' GB'
  };
}

async function runPerformanceMonitor() {
  console.log('⚡ Running performance monitor...\n');
  
  try {
    const metrics = getPerformanceMetrics();
    
    console.log('📊 System Performance Metrics:');
    console.log(`   Memory Usage:`);
    console.log(`     RSS: ${metrics.memory.rss}`);
    console.log(`     Heap Total: ${metrics.memory.heapTotal}`);
    console.log(`     Heap Used: ${metrics.memory.heapUsed}`);
    console.log(`     External: ${metrics.memory.external}`);
    console.log(`   CPU Usage:`);
    console.log(`     User: ${metrics.cpu.user}μs`);
    console.log(`     System: ${metrics.cpu.system}μs`);
    console.log(`   System Info:`);
    console.log(`     Uptime: ${Math.round(metrics.uptime)}s`);
    console.log(`     Platform: ${metrics.platform} ${metrics.arch}`);
    console.log(`     Total Memory: ${metrics.totalMemory}`);
    console.log(`     Free Memory: ${metrics.freeMemory}`);
    
    // Check if memory usage is reasonable
    const heapUsedMB = parseInt(metrics.memory.heapUsed);
    if (heapUsedMB > 100) {
      console.log('⚠️  High memory usage detected');
    } else {
      console.log('✅ Memory usage is within normal range');
    }
    
    console.log('\n✅ Performance monitoring completed');
    
  } catch (error) {
    console.error('❌ Error in performance monitoring:', error.message);
    process.exit(1);
  }
}

runPerformanceMonitor();
