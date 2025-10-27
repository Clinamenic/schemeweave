import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';
import { SortableTagInput } from './ui/SortableTagInput';
import { SortableField } from './SortableField';
import { AddCustomFieldModal } from './AddCustomFieldModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface DocumentFormProps {
  schema: string;
  template?: string;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ schema, template }) => {
  const { 
    formData, 
    updateFormData, 
    validationErrors, 
    reorderField, 
    addCustomField, 
    removeCustomField,
    customFields,
    resetToTemplateOrder
  } = useAppStore();
  const schemaDef = schemas[schema as keyof typeof schemas];
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleFieldChange = (fieldId: string, value: any) => {
    updateFormData({ [fieldId]: value });
  };

  const handleDragStart = (event: any) => {
    setActiveField(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      // Get current field order
      const fields = getOrderedFields();
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder the field
        reorderField(active.id as string, newIndex);
      }
    }
    
    setActiveField(null);
  };

  const getOrderedFields = () => {
    const schemaKey = `${schema}-${template || 'default'}`;
    const templateFields = [...schemaDef.fields];
    const userCustomFields = customFields[schemaKey] || [];
    
    // Combine template fields and custom fields
    const allFields = [...templateFields, ...userCustomFields];
    
    // Get the field order from the store
    const fieldOrder = useAppStore.getState().fieldOrder[schemaKey] || {};
    
    // Sort fields by their order property, using store order if available
    return allFields.sort((a, b) => {
      // Use store order if available, otherwise fall back to field.order
      const orderA = (fieldOrder as Record<string, number>)[a.id] !== undefined ? (fieldOrder as Record<string, number>)[a.id] : (a.order ?? 999);
      const orderB = (fieldOrder as Record<string, number>)[b.id] !== undefined ? (fieldOrder as Record<string, number>)[b.id] : (b.order ?? 999);
      return orderA - orderB;
    });
  };

  const renderField = (field: any) => {
    const fieldValue = formData[field.id] || '';
    const errors = validationErrors[field.id] || [];
    const isCustom = field.isCustom || false;

    const fieldContent = (
      <div className="form-field">
        <div className="field-label-container">
          <label className="field-label">
            {field.label}
            {field.required && <span className="required">*</span>}
            {isCustom && <span className="custom-badge">Custom</span>}
          </label>
          <div className="field-actions">
            {field.description && (
              <button 
                type="button" 
                className="field-help-button"
                title={field.type === 'array' 
                  ? `${field.description}\n\nPress Enter or comma to add a keyword` 
                  : field.description
                }
              >
                ?
              </button>
            )}
            {isCustom && (
              <button
                type="button"
                className="field-remove-button"
                onClick={() => removeCustomField(field.id)}
                title="Remove custom field"
              >
                ×
              </button>
            )}
          </div>
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
            <SortableTagInput
              value={Array.isArray(fieldValue) ? fieldValue : []}
              onChange={(tags) => handleFieldChange(field.id, tags)}
              placeholder={field.helpText}
              className={errors.length > 0 ? 'error' : ''}
              enableDragAndDrop={true}
            />
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

    return (
      <SortableField key={field.id} field={field}>
        {fieldContent}
      </SortableField>
    );
  };

  const orderedFields = getOrderedFields();

  return (
    <div className="document-form">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">Document Composer</div>
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={resetToTemplateOrder}
              title="Reset fields to template order"
            >
              Reset Order
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddFieldModal(true)}
            >
              + Add Custom Field
            </button>
          </div>
        </div>
        <div className="terminal-body">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedFields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="form-content">
                {orderedFields.map(renderField)}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeField ? (
                <div className="drag-overlay">
                  {renderField(orderedFields.find(field => field.id === activeField)!)}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      
      <AddCustomFieldModal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onAddField={addCustomField}
      />
    </div>
  );
};
