import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';

export const NavigationHeader: React.FC = () => {
  const { currentSchema, currentTemplate, setCurrentSchema, setCurrentTemplate } = useAppStore();

  const schema = currentSchema ? schemas[currentSchema as keyof typeof schemas] : null;

  return (
    <div className="navigation-header">
      <div className="nav-primary">
        <div className="nav-title">Schemeweave</div>
        <div className="nav-schema">
          <span className="nav-label">Schema:</span>
          <div className="schema-tabs">
            {Object.entries(schemas).map(([key, schemaDef]) => (
              <button
                key={key}
                className={`schema-tab ${currentSchema === key ? 'active' : ''}`}
                onClick={() => setCurrentSchema(key)}
              >
                {schemaDef.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {schema && (
        <div className="nav-secondary">
          <div className="nav-template">
            <span className="nav-label">Template:</span>
            <div className="template-tabs">
              <button
                className={`template-tab ${!currentTemplate ? 'active' : ''}`}
                onClick={() => setCurrentTemplate(undefined)}
              >
                Custom
              </button>
              {schema.templates.map((template) => (
                <button
                  key={template.id}
                  className={`template-tab ${currentTemplate === template.id ? 'active' : ''}`}
                  onClick={() => setCurrentTemplate(template.id)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
