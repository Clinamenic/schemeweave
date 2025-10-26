// Arweave deployment configuration
const path = require('path');

module.exports = {
    // Wallet configuration
    walletPath: path.join(__dirname, 'wallet.json'),

    // Build configuration
    buildDir: 'dist',
    buildCommand: 'npm run build',

    // Deployment settings
    appName: '{{APP_NAME}}', // Replace with your app name
    description: '{{APP_DESCRIPTION}}', // Replace with your app description

    // ArNS configuration (optional)
    arnsName: '{{ARNS_NAME}}', // Reserve this name for later

    // Tags for discovery
    tags: [
        { name: 'App-Name', value: '{{APP_NAME}}' },
        { name: 'App-Version', value: process.env.npm_package_version || '0.1.0' },
        { name: 'Content-Type', value: 'text/html' },
        { name: 'App-Type', value: 'web-app' },
        { name: 'Category', value: '{{CATEGORY}}' }, // e.g., 'productivity', 'design-tools', 'games'
        { name: 'Keywords', value: '{{KEYWORDS}}' } // e.g., 'tool,utility,web3'
    ],

    // Deployment options
    options: {
        // Automatically open the deployed app after upload
        openAfterDeploy: true,

        // Show verbose output during deployment
        verbose: true,

        // Retry failed uploads
        retryAttempts: 3
    }
};

