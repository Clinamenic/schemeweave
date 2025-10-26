import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';

export const TemplateSelector: React.FC = () => {
  const { currentSchema, currentTemplate, setCurrentTemplate } = useAppStore();

  if (!currentSchema) return null;

  const schema = schemas[currentSchema as keyof typeof schemas];
  const templates = schema.templates;

  return (
    <div className="template-selector">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
          <div className="terminal-title">template-selector</div>
        </div>
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">Select Template:</span>
          </div>
          
          <div className="template-options">
            <button
              className={`template-option ${!currentTemplate ? 'active' : ''}`}
              onClick={() => setCurrentTemplate(undefined)}
            >
              <div className="template-name">Custom</div>
              <div className="template-description">Start with empty form</div>
            </button>
            
            {templates.map((template) => (
              <button
                key={template.id}
                className={`template-option ${currentTemplate === template.id ? 'active' : ''}`}
                onClick={() => setCurrentTemplate(template.id)}
              >
                <div className="template-name">{template.name}</div>
                <div className="template-description">{template.description}</div>
              </button>
            ))}
          </div>
          
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">
              Current: {currentTemplate || 'Custom'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
