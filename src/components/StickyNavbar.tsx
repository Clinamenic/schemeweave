import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';
import { ExportDialog } from './ExportDialog';
import { AddCustomFieldModal } from './AddCustomFieldModal';
import { SaveIcon, ExportIcon, ExpandSidebarIcon, CollapseSidebarIcon, ResetIcon, PlusIcon } from './icons';

export const StickyNavbar: React.FC = () => {
  const { 
    currentSchema, 
    currentTemplate, 
    setCurrentSchema, 
    setCurrentTemplate,
    saveDocument,
    showPreview,
    setShowPreview,
    isDirty,
    addCustomField,
    resetToTemplateOrder
  } = useAppStore();

  const [exportDialog, setExportDialog] = useState<{ isOpen: boolean; format: string }>({
    isOpen: false,
    format: 'json'
  });

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  const schema = currentSchema ? schemas[currentSchema as keyof typeof schemas] : null;

  const handleSchemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCurrentSchema(value);
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
      <div className="sticky-navbar">
        <div className="navbar-content">
          {/* Left side - Schema and Template selectors */}
          <div className="navbar-left">
            <div className="navbar-schema">
              <select 
                className="navbar-dropdown"
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
              <div className="navbar-template">
                <select 
                  className="navbar-dropdown"
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

            {/* Reset template button */}
            {currentTemplate && (
              <button
                type="button"
                className="navbar-button icon-only"
                onClick={resetToTemplateOrder}
                title="Reset fields to template order"
              >
                <ResetIcon className="button-icon" size={16} />
              </button>
            )}

            {/* New custom field button */}
            {schema && (
              <button
                type="button"
                className="navbar-button primary icon-only"
                onClick={() => setShowAddFieldModal(true)}
                title="Add custom field"
              >
                <PlusIcon className="button-icon" size={16} />
              </button>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="navbar-right">
            <button 
              className="navbar-button primary icon-only"
              onClick={saveDocument}
              disabled={!isDirty}
              title="Save Document"
            >
              <SaveIcon className="button-icon" size={16} />
            </button>
            
            <button 
              className="navbar-button icon-only"
              onClick={handleExport}
              title="Export Document"
            >
              <ExportIcon className="button-icon" size={16} />
            </button>
            
            <button 
              className={`navbar-button toggle icon-only ${showPreview ? 'active' : ''}`}
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

      <AddCustomFieldModal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onAddField={addCustomField}
      />
    </>
  );
};
