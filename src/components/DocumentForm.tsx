import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';

interface DocumentFormProps {
  schema: string;
  template?: string;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ schema, template }) => {
  const { formData, updateFormData, validationErrors } = useAppStore();
  const schemaDef = schemas[schema as keyof typeof schemas];

  const handleFieldChange = (fieldId: string, value: any) => {
    updateFormData({ [fieldId]: value });
  };

  const renderField = (field: any) => {
    const fieldValue = formData[field.id] || '';
    const errors = validationErrors[field.id] || [];

    return (
      <div key={field.id} className="form-field">
        <div className="field-label-container">
          <label className="field-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {field.description && (
            <button 
              type="button" 
              className="field-help-button"
              title={field.description}
            >
              ?
            </button>
          )}
        </div>
        
        {field.type === 'string' && (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`field-input ${errors.length > 0 ? 'error' : ''}`}
            placeholder={field.helpText}
          />
        )}
        
        {field.type === 'email' && (
          <input
            type="email"
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`field-input ${errors.length > 0 ? 'error' : ''}`}
            placeholder={field.helpText}
          />
        )}
        
        {field.type === 'url' && (
          <input
            type="url"
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`field-input ${errors.length > 0 ? 'error' : ''}`}
            placeholder={field.helpText}
          />
        )}
        
        {field.type === 'array' && (
          <div className="array-field">
            <textarea
              value={Array.isArray(fieldValue) ? fieldValue.join('\n') : ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value.split('\n').filter(item => item.trim()))}
              className={`field-textarea ${errors.length > 0 ? 'error' : ''}`}
              placeholder={field.helpText}
              rows={3}
            />
            <div className="array-help">Enter one item per line</div>
          </div>
        )}
        
        {field.type === 'object' && field.nestedFields && (
          <div className="object-field">
            {field.nestedFields.map((nestedField: any) => {
              const nestedValue = fieldValue[nestedField.id] || '';
              const nestedErrors = validationErrors[`${field.id}.${nestedField.id}`] || [];
              
              return (
                <div key={nestedField.id} className="nested-field">
                  <div className="field-label-container">
                    <label className="nested-label">
                      {nestedField.label}
                      {nestedField.required && <span className="required">*</span>}
                    </label>
                    {nestedField.description && (
                      <button 
                        type="button" 
                        className="field-help-button"
                        title={nestedField.description}
                      >
                        ?
                      </button>
                    )}
                  </div>
                  <input
                    type={nestedField.type === 'email' ? 'email' : nestedField.type === 'url' ? 'url' : 'text'}
                    value={nestedValue}
                    onChange={(e) => {
                      const newValue = { ...fieldValue, [nestedField.id]: e.target.value };
                      handleFieldChange(field.id, newValue);
                    }}
                    className={`nested-input ${nestedErrors.length > 0 ? 'error' : ''}`}
                    placeholder={nestedField.helpText}
                  />
                </div>
              );
            })}
          </div>
        )}
        
        {errors.length > 0 && (
          <div className="field-errors">
            {errors.map((error, index) => (
              <div key={index} className="field-error">{error}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="document-form">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">Document Composer</div>
        </div>
        <div className="terminal-body">
          <div className="form-content">
            {schemaDef.fields.map(renderField)}
          </div>
        </div>
      </div>
    </div>
  );
};
