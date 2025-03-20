// Production build script with optimizations
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build directory
const distDir = path.join(__dirname, 'dist');

// Clean up previous build
console.log('Cleaning up previous build...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('Previous build removed.');
}

// Set a higher Node.js memory limit for the build
const buildCommand = 'node --max-old-space-size=4096 ./node_modules/.bin/astro build';

console.log('Starting production build with optimizations...');
console.log('This may take a few minutes. Please be patient.');

// Execute the build command with a timeout
const buildProcess = exec(buildCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Build warnings: ${stderr}`);
  }
  
  console.log('Build completed successfully!');
  console.log('Output:');
  console.log(stdout);
});

// Set a timeout to prevent hanging (30 minutes)
const timeoutMinutes = 30;
const timeout = setTimeout(() => {
  console.log(`Build timed out after ${timeoutMinutes} minutes.`);
  buildProcess.kill();
}, timeoutMinutes * 60 * 1000);

// Clear the timeout if the build completes
buildProcess.on('exit', () => {
  clearTimeout(timeout);
});

// Log output in real-time
buildProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

buildProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});
