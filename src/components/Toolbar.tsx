import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ExportDialog } from './ExportDialog';
import { SaveIcon, ExpandSidebarIcon, CollapseSidebarIcon } from './icons';

export const Toolbar: React.FC = () => {
  const { 
    saveDocument, 
    showPreview, 
    setShowPreview,
    isDirty 
  } = useAppStore();

  const [exportDialog, setExportDialog] = useState<{ isOpen: boolean; format: string }>({
    isOpen: false,
    format: 'json'
  });

  const handleExport = () => {
    setExportDialog({ isOpen: true, format: 'json' });
  };

  const closeExportDialog = () => {
    setExportDialog({ isOpen: false, format: 'json' });
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-section">
          <button 
            className="toolbar-button primary icon-only"
            onClick={saveDocument}
            disabled={!isDirty}
            title="Save Document"
          >
            <SaveIcon className="button-icon" size={16} />
          </button>
          
          <button 
            className="toolbar-button icon-only"
            onClick={handleExport}
            title="Export Document"
          >
            Export
          </button>
        </div>
        
        <div className="toolbar-section">
          <button 
            className={`toolbar-button toggle icon-only ${showPreview ? 'active' : ''}`}
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

      <ExportDialog 
        isOpen={exportDialog.isOpen}
        onClose={closeExportDialog}
        format={exportDialog.format}
      />
    </>
  );
};
