import { useState, useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { StickyNavbar } from './components/StickyNavbar';
import { StickyFooter } from './components/StickyFooter';
import { DocumentForm } from './components/DocumentForm';
import { PreviewPanel } from './components/PreviewPanel';
import './App.css';

function App() {
  const { 
    currentSchema, 
    currentTemplate, 
    showPreview, 
    isDirty 
  } = useAppStore();

  const [shouldRenderPreview, setShouldRenderPreview] = useState(showPreview);

  useEffect(() => {
    if (showPreview) {
      setShouldRenderPreview(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRenderPreview(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  return (
    <div className="app">
      <StickyNavbar />

      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="app-logo">ȿ</div>
            <h1 className="app-title">schemeweave</h1>
          </div>
          <div className="app-subtitle">
            Semantic Document Composer
          </div>
        </div>
      </header>

      <main className="app-main">
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

      <StickyFooter />
    </div>
  );
}

export default App;

