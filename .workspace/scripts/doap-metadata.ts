import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export interface DoapMetadataOptions {
    doapPath: string
}

export function doapMetadataPlugin(options: DoapMetadataOptions): Plugin {
    return {
        name: 'doap-metadata',
        writeBundle() {
            // Copy doap.json to dist directory after build is complete
            try {
                const distPath = path.join(process.cwd(), 'dist')
                const doapDestPath = path.join(distPath, 'doap.json')

                // Ensure dist directory exists
                if (!fs.existsSync(distPath)) {
                    fs.mkdirSync(distPath, { recursive: true })
                }

                // Copy doap.json to dist
                fs.copyFileSync(options.doapPath, doapDestPath)
                console.log(`📄 Copied doap.json to dist directory for public access`)
            } catch (error) {
                console.warn('Warning: Could not copy doap.json to dist directory:', error)
            }
        },
        transformIndexHtml: {
            enforce: 'pre',
            transform(html, context) {
                try {
                    // Read doap.json
                    const doapData = JSON.parse(fs.readFileSync(options.doapPath, 'utf8'))

                    // Extract metadata with fallbacks for placeholders
                    const metadata = {
                        PROJECT_NAME: doapData.name || '{{PROJECT_NAME}}',
                        PROJECT_DESCRIPTION: doapData.description || '{{PROJECT_DESCRIPTION}}',
                        PROJECT_VERSION: doapData.version || '{{PROJECT_VERSION}}',
                        AUTHOR_NAME: doapData.author?.name || '{{AUTHOR_NAME}}',
                        AUTHOR_EMAIL: doapData.author?.email || '{{AUTHOR_EMAIL}}',
                        AUTHOR_URL: doapData.author?.url || '{{AUTHOR_URL}}',
                        PROJECT_URL: doapData.url || '{{PROJECT_URL}}',
                        PROJECT_HOMEPAGE_URL: doapData.homepage || '{{PROJECT_HOMEPAGE_URL}}',
                        KEYWORDS: doapData.keywords?.join(', ') || '{{KEYWORDS}}',
                        FEATURE_1: doapData.featureList?.[0] || '{{FEATURE_1}}',
                        FEATURE_2: doapData.featureList?.[1] || '{{FEATURE_2}}',
                        FEATURE_3: doapData.featureList?.[2] || '{{FEATURE_3}}',
                        REPOSITORY_URL: doapData.repository?.url || '{{REPOSITORY_URL}}',
                        ISSUE_TRACKER_URL: doapData.issueTracker || '{{ISSUE_TRACKER_URL}}',
                        DOCUMENTATION_URL: doapData.documentation || '{{DOCUMENTATION_URL}}',
                        CHANGELOG_URL: doapData.changelog?.url || '{{CHANGELOG_URL}}',
                        DEPLOYMENT_VERSION: doapData.deployments?.[0]?.version || doapData.version || '{{DEPLOYMENT_VERSION}}',
                        DEPLOYMENT_URL: doapData.deployments?.[0]?.url || '{{DEPLOYMENT_URL}}',
                        ARWEAVE_TX_ID: doapData.deployments?.[0]?.transactionId || '{{ARWEAVE_TX_ID}}',
                        DEPLOYMENT_DATE: doapData.deployments?.[0]?.deploymentDate || new Date().toISOString(),
                        DEPLOYMENT_ENV: doapData.deployments?.[0]?.environment || '{{DEPLOYMENT_ENV}}'
                    }

                    // Replace placeholders in HTML
                    let processedHtml = html
                    Object.entries(metadata).forEach(([key, value]) => {
                        const placeholder = `{{${key}}}`
                        processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), value || '')
                    })

                    return processedHtml
                } catch (error) {
                    console.warn('Warning: Could not read doap.json for metadata injection:', error)
                    return html
                }
            }
        }
    }
}
