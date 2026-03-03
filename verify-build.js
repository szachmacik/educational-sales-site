const { execSync } = require('child_process');

try {
    console.log("Building project to verify type safety and build integrity...");
    // We use the full path to npm if needed, but 'npm' usually works given the PATH issue earlier.
    // Wait, the PATH issue was that 'node' wasn't found. 'npm' might be missing too.
    // I will assume 'npm' is missing if 'node' was missing.
    // I will check for npm first.

    execSync('npm run build', { stdio: 'inherit' });
    console.log("Build SUCCESS!");
} catch (error) {
    console.error("Build FAILED!");
    process.exit(1);
}
