const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestReportGenerator {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        coverage: 0
      },
      sections: {
        backend: {},
        frontend: {},
        database: {},
        api: {},
        performance: {}
      },
      details: []
    };
  }

  async generateReport() {
    console.log('🧪 Generating comprehensive test report...\n');
    
    try {
      await this.runBackendTests();
      await this.runDatabaseTests();
      await this.runAPITests();
      await this.runPerformanceTests();
      await this.generateHTMLReport();
      
      console.log('✅ Test report generated successfully!');
      console.log('📊 Report saved to: test-reports/comprehensive-test-report.html');
      
    } catch (error) {
      console.error('❌ Error generating test report:', error.message);
      process.exit(1);
    }
  }

  async runBackendTests() {
    console.log('🔧 Running backend tests...');
    
    try {
      // Run Jest tests with coverage
      const jestOutput = execSync('npm run test:cov', { 
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.report.sections.backend = {
        status: 'passed',
        output: jestOutput,
        timestamp: new Date().toISOString()
      };
      
      // Extract coverage information
      const coverageMatch = jestOutput.match(/All files\s+\|\s+(\d+\.\d+)/);
      if (coverageMatch) {
        this.report.summary.coverage = parseFloat(coverageMatch[1]);
      }
      
      console.log('✅ Backend tests completed');
      
    } catch (error) {
      this.report.sections.backend = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log('❌ Backend tests failed');
    }
  }

  async runDatabaseTests() {
    console.log('🗄️ Running database tests...');
    
    const dbTests = [
      'test-connection.js',
      'test-chat-system.js',
      'test-remote-db.js'
    ];
    
    this.report.sections.database = {
      tests: [],
      status: 'passed',
      timestamp: new Date().toISOString()
    };
    
    for (const testFile of dbTests) {
      try {
        const output = execSync(`node scripts/${testFile}`, {
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        this.report.sections.database.tests.push({
          name: testFile,
          status: 'passed',
          output: output
        });
        
        console.log(`✅ ${testFile} passed`);
        
      } catch (error) {
        this.report.sections.database.tests.push({
          name: testFile,
          status: 'failed',
          error: error.message
        });
        
        console.log(`❌ ${testFile} failed`);
        this.report.sections.database.status = 'failed';
      }
    }
  }

  async runAPITests() {
    console.log('🌐 Running API tests...');
    
    const apiTests = [
      'test-api-endpoints.js',
      'test-backend-health.js',
      'test-chat-endpoints.js'
    ];
    
    this.report.sections.api = {
      tests: [],
      status: 'passed',
      timestamp: new Date().toISOString()
    };
    
    for (const testFile of apiTests) {
      try {
        const output = execSync(`node scripts/${testFile}`, {
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        this.report.sections.api.tests.push({
          name: testFile,
          status: 'passed',
          output: output
        });
        
        console.log(`✅ ${testFile} passed`);
        
      } catch (error) {
        this.report.sections.api.tests.push({
          name: testFile,
          status: 'failed',
          error: error.message
        });
        
        console.log(`❌ ${testFile} failed`);
        this.report.sections.api.status = 'failed';
      }
    }
  }

  async runPerformanceTests() {
    console.log('⚡ Running performance tests...');
    
    try {
      const output = execSync('npm run perf:monitor', {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.report.sections.performance = {
        status: 'passed',
        output: output,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Performance tests completed');
      
    } catch (error) {
      this.report.sections.performance = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log('❌ Performance tests failed');
    }
  }

  async generateHTMLReport() {
    const html = this.generateHTML();
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'test-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Write HTML report
    const reportPath = path.join(reportsDir, 'comprehensive-test-report.html');
    fs.writeFileSync(reportPath, html);
    
    // Write JSON report
    const jsonPath = path.join(reportsDir, 'test-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.report, null, 2));
  }

  generateHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moonsun System Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .value { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .test-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #ddd; }
        .test-item.passed { border-left-color: #28a745; }
        .test-item.failed { border-left-color: #dc3545; }
        .timestamp { color: #666; font-size: 0.9em; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 0.9em; }
        .coverage-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .coverage-fill { height: 100%; background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%); transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Moonsun System Test Report</h1>
            <p class="timestamp">Generated: ${this.report.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Test Coverage</h3>
                <div class="value ${this.report.summary.coverage >= 80 ? 'passed' : 'failed'}">${this.report.summary.coverage}%</div>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: ${this.report.summary.coverage}%"></div>
                </div>
            </div>
            <div class="summary-card">
                <h3>Backend Tests</h3>
                <div class="value ${this.report.sections.backend.status === 'passed' ? 'passed' : 'failed'}">${this.report.sections.backend.status}</div>
            </div>
            <div class="summary-card">
                <h3>Database Tests</h3>
                <div class="value ${this.report.sections.database.status === 'passed' ? 'passed' : 'failed'}">${this.report.sections.database.status}</div>
            </div>
            <div class="summary-card">
                <h3>API Tests</h3>
                <div class="value ${this.report.sections.api.status === 'passed' ? 'passed' : 'failed'}">${this.report.sections.api.status}</div>
            </div>
        </div>
        
        <div class="section">
            <h2>🔧 Backend Tests</h2>
            <div class="test-item ${this.report.sections.backend.status}">
                <strong>Jest Unit Tests</strong>
                <span class="timestamp">${this.report.sections.backend.timestamp}</span>
                ${this.report.sections.backend.output ? `<pre>${this.report.sections.backend.output}</pre>` : ''}
            </div>
        </div>
        
        <div class="section">
            <h2>🗄️ Database Tests</h2>
            ${this.report.sections.database.tests.map(test => `
                <div class="test-item ${test.status}">
                    <strong>${test.name}</strong>
                    ${test.error ? `<p>Error: ${test.error}</p>` : ''}
                    ${test.output ? `<pre>${test.output}</pre>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>🌐 API Tests</h2>
            ${this.report.sections.api.tests.map(test => `
                <div class="test-item ${test.status}">
                    <strong>${test.name}</strong>
                    ${test.error ? `<p>Error: ${test.error}</p>` : ''}
                    ${test.output ? `<pre>${test.output}</pre>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>⚡ Performance Tests</h2>
            <div class="test-item ${this.report.sections.performance.status}">
                <strong>Performance Monitor</strong>
                <span class="timestamp">${this.report.sections.performance.timestamp}</span>
                ${this.report.sections.performance.output ? `<pre>${this.report.sections.performance.output}</pre>` : ''}
                ${this.report.sections.performance.error ? `<p>Error: ${this.report.sections.performance.error}</p>` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

// Run the report generator
const generator = new TestReportGenerator();
generator.generateReport();
