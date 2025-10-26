import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';

export const SchemaSelector: React.FC = () => {
  const { currentSchema, setCurrentSchema } = useAppStore();

  return (
    <div className="schema-selector">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
          <div className="terminal-title">schema-selector</div>
        </div>
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">Select Schema:</span>
          </div>
          
          <div className="schema-options">
            {Object.entries(schemas).map(([key, schema]) => (
              <button
                key={key}
                className={`schema-option ${currentSchema === key ? 'active' : ''}`}
                onClick={() => setCurrentSchema(key)}
              >
                <div className="schema-name">{schema.name}</div>
                <div className="schema-description">{schema.description}</div>
                <div className="schema-namespace">{schema.namespace}</div>
              </button>
            ))}
          </div>
          
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">
              Current: {currentSchema ? schemas[currentSchema as keyof typeof schemas].name : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
