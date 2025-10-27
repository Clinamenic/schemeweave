import React, { useState } from 'react';
import { CustomFieldDefinition } from '../types';

interface AddCustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: CustomFieldDefinition) => void;
}

export const AddCustomFieldModal: React.FC<AddCustomFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField
}) => {
  const [fieldData, setFieldData] = useState({
    label: '',
    type: 'string' as const,
    required: false,
    description: '',
    helpText: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fieldData.label.trim()) return;

    const customField: CustomFieldDefinition = {
      id: `custom-${Date.now()}`,
      label: fieldData.label.trim(),
      type: fieldData.type,
      required: fieldData.required,
      description: fieldData.description.trim(),
      helpText: fieldData.helpText.trim(),
      order: 999, // Will be updated by the store
      isCustom: true,
      dragHandleId: `drag-${Date.now()}`
    };

    onAddField(customField);
    
    // Reset form
    setFieldData({
      label: '',
      type: 'string',
      required: false,
      description: '',
      helpText: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Add Custom Field</h3>
          <button 
            type="button" 
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-field">
            <label className="field-label">
              Field Label *
            </label>
            <input
              type="text"
              value={fieldData.label}
              onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
              className="field-input"
              placeholder="Enter field label"
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label">
              Field Type
            </label>
            <select
              value={fieldData.type}
              onChange={(e) => setFieldData({ ...fieldData, type: e.target.value as any })}
              className="field-input"
            >
              <option value="string">Text</option>
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="array">Array</option>
              <option value="object">Object</option>
            </select>
          </div>

          <div className="form-field">
            <label className="field-label">
              <input
                type="checkbox"
                checked={fieldData.required}
                onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                className="field-checkbox"
              />
              Required Field
            </label>
          </div>

          <div className="form-field">
            <label className="field-label">
              Description
            </label>
            <input
              type="text"
              value={fieldData.description}
              onChange={(e) => setFieldData({ ...fieldData, description: e.target.value })}
              className="field-input"
              placeholder="Brief description of the field"
            />
          </div>

          <div className="form-field">
            <label className="field-label">
              Help Text
            </label>
            <input
              type="text"
              value={fieldData.helpText}
              onChange={(e) => setFieldData({ ...fieldData, helpText: e.target.value })}
              className="field-input"
              placeholder="Help text shown to users"
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Add Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
