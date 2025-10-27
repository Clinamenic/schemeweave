import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';
import { ExportDialog } from './ExportDialog';
import { SaveIcon, ExportIcon, ExpandSidebarIcon, CollapseSidebarIcon } from './icons';

export const NavigationHeader: React.FC = () => {
  const { 
    currentSchema, 
    currentTemplate, 
    setCurrentSchema, 
    setCurrentTemplate,
    saveDocument,
    showPreview,
    setShowPreview,
    isDirty
  } = useAppStore();

  const [exportDialog, setExportDialog] = useState<{ isOpen: boolean; format: string }>({
    isOpen: false,
    format: 'json'
  });

  const schema = currentSchema ? schemas[currentSchema as keyof typeof schemas] : null;

  const handleSchemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCurrentSchema(value || null);
    // Reset template when schema changes
    setCurrentTemplate(undefined);
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCurrentTemplate(value || undefined);
  };

  const handleExport = () => {
    setExportDialog({ isOpen: true, format: 'json' });
  };

  const closeExportDialog = () => {
    setExportDialog({ isOpen: false, format: 'json' });
  };

  return (
    <>
      <div className="navigation-header">
        <div className="nav-content">
          <div className="nav-selectors">
            <div className="nav-schema">
              <span className="nav-label">Schema:</span>
              <select 
                className="schema-dropdown"
                value={currentSchema || ''}
                onChange={handleSchemaChange}
              >
                <option value="">Select Schema</option>
                {Object.entries(schemas).map(([key, schemaDef]) => (
                  <option key={key} value={key}>
                    {schemaDef.name}
                  </option>
                ))}
              </select>
            </div>
            
            {schema && (
              <div className="nav-template">
                <span className="nav-label">Template:</span>
                <select 
                  className="template-dropdown"
                  value={currentTemplate || ''}
                  onChange={handleTemplateChange}
                >
                  <option value="">Custom</option>
                  {schema.templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button 
              className="nav-button primary icon-only"
              onClick={saveDocument}
              disabled={!isDirty}
              title="Save Document"
            >
              <SaveIcon className="button-icon" size={16} />
            </button>
            
            <button 
              className="nav-button icon-only"
              onClick={handleExport}
              title="Export Document"
            >
              <ExportIcon className="button-icon" size={16} />
            </button>
            
            <button 
              className={`nav-button toggle icon-only ${showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? (
                <CollapseSidebarIcon className="button-icon" size={16} />
              ) : (
                <ExpandSidebarIcon className="button-icon" size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      <ExportDialog 
        isOpen={exportDialog.isOpen}
        onClose={closeExportDialog}
        format={exportDialog.format}
      />
    </>
  );
};
