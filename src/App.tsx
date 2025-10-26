import React, { useState, useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { NavigationHeader } from './components/NavigationHeader';
import { DocumentForm } from './components/DocumentForm';
import { PreviewPanel } from './components/PreviewPanel';
import { Toolbar } from './components/Toolbar';
import './App.css';

function App() {
  const { 
    currentSchema, 
    currentTemplate, 
    showPreview, 
    formData,
    isDirty 
  } = useAppStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(showPreview);

  useEffect(() => {
    if (showPreview) {
      setShouldRenderPreview(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldRenderPreview(false);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="terminal-prompt">
              <span className="prompt-user">user@schemeweave</span>
              <span className="prompt-separator">:</span>
              <span className="prompt-path">~/semantic-docs</span>
              <span className="prompt-symbol">$</span>
            </div>
          </div>
          <h1 className="app-title">Schemeweave</h1>
          <div className="app-subtitle">
            Semantic Document Composer
          </div>
          <div className="version-info">
            <span className="version-badge">
              v{import.meta.env.VITE_APP_VERSION || '0.1.0'}
            </span>
            <div className="company-container">
              <a
                href="https://www.clinamenic.com?ref=schemeweave"
                target="_blank"
                rel="noopener noreferrer"
                className="company-link"
              >
                by Clinamenic LLC
              </a>
            </div>
          </div>
        </div>
      </header>

      <NavigationHeader />

      <main className="app-main">
        <Toolbar />
        
        <div className={`app-content ${!showPreview ? 'preview-hidden' : ''}`}>
          <div className="app-center">
            {currentSchema && (
              <DocumentForm 
                schema={currentSchema}
                template={currentTemplate}
              />
            )}
            
            {!currentSchema && (
              <div className="welcome-message">
                <div className="terminal-window">
                  <div className="terminal-body">
                    <div className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-text">
                        Welcome to Schemeweave - Semantic Document Composer
                      </span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-text">
                        Select a schema to begin creating semantic documents
                      </span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-text">
                        Available schemas: DOAP, FOAF
                      </span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span className="terminal-cursor">_</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {shouldRenderPreview && (
            <div className={`app-preview ${!showPreview ? 'hidden' : ''}`}>
              <PreviewPanel />
            </div>
          )}
        </div>
      </main>

      {isDirty && (
        <div className="save-indicator">
          <span className="save-text">Unsaved changes</span>
        </div>
      )}
    </div>
  );
}

export default App;

