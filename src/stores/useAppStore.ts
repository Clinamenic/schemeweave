import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormState, DocumentInstance, ExportOptions, CustomFieldDefinition } from '../types';
import { schemas } from '../services/schemas';

interface AppStore extends FormState {
  // Schema management
  availableSchemas: string[];
  currentSchema: string;
  currentTemplate?: string;
  
  // Form data
  formData: Record<string, any>;
  validationErrors: Record<string, string[]>;
  isDirty: boolean;
  lastSaved?: string;
  
  // Document management
  documents: DocumentInstance[];
  currentDocument?: DocumentInstance;
  
  // Export options
  exportOptions: ExportOptions;
  
  // UI state
  showPreview: boolean;
  previewFormat: 'json' | 'json-ld' | 'xml' | 'turtle';
  
  // Field ordering and management
  fieldOrder: Record<string, Record<string, number>>; // schema -> field order mapping
  customFields: Record<string, CustomFieldDefinition[]>; // schema -> custom fields
  arrayItemOrders: Record<string, Record<string, number>>; // fieldId -> itemId -> order
  
  // Actions
  setCurrentSchema: (schema: string) => void;
  setCurrentTemplate: (template?: string) => void;
  updateFormData: (data: Record<string, any>) => void;
  setValidationErrors: (errors: Record<string, string[]>) => void;
  setDirty: (dirty: boolean) => void;
  saveDocument: () => void;
  loadDocument: (document: DocumentInstance) => void;
  exportDocument: (format: ExportOptions['format']) => void;
  setShowPreview: (show: boolean) => void;
  setPreviewFormat: (format: 'json' | 'json-ld' | 'xml' | 'turtle') => void;
  resetForm: () => void;
  
  // Field ordering actions
  reorderField: (fieldId: string, newOrder: number) => void;
  addCustomField: (field: CustomFieldDefinition) => void;
  removeCustomField: (fieldId: string) => void;
  reorderArrayItem: (fieldId: string, itemId: string, newOrder: number) => void;
  resetToTemplateOrder: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      availableSchemas: ['doap', 'foaf'],
      currentSchema: 'doap',
      currentTemplate: undefined,
      formData: {},
      validationErrors: {},
      isDirty: false,
      lastSaved: undefined,
      documents: [],
      currentDocument: undefined,
      exportOptions: {
        format: 'json',
        pretty: true,
        includeMetadata: true,
      },
      showPreview: true,
      previewFormat: 'json',
      
      // Field ordering state
      fieldOrder: {},
      customFields: {},
      arrayItemOrders: {},
      
      // Actions
      setCurrentSchema: (schema: string) => {
        set({ 
          currentSchema: schema, 
          currentTemplate: undefined,
          formData: {},
          validationErrors: {},
          isDirty: false 
        });
      },
      
      setCurrentTemplate: (template?: string) => {
        set({ 
          currentTemplate: template,
          formData: {},
          validationErrors: {},
          isDirty: false 
        });
      },
      
      updateFormData: (data: Record<string, any>) => {
        set({ 
          formData: { ...get().formData, ...data },
          isDirty: true 
        });
      },
      
      setValidationErrors: (errors: Record<string, string[]>) => {
        set({ validationErrors: errors });
      },
      
      setDirty: (dirty: boolean) => {
        set({ isDirty: dirty });
      },
      
      saveDocument: () => {
        const state = get();
        const document: DocumentInstance = {
          schema: state.currentSchema,
          template: state.currentTemplate,
          data: state.formData,
          metadata: {
            created: state.currentDocument?.metadata.created || new Date().toISOString(),
            modified: new Date().toISOString(),
            version: '1.0.0',
          },
        };
        
        set({ 
          currentDocument: document,
          documents: [...state.documents.filter(d => d !== state.currentDocument), document],
          isDirty: false,
          lastSaved: new Date().toISOString()
        });
      },
      
      loadDocument: (document: DocumentInstance) => {
        set({
          currentDocument: document,
          currentSchema: document.schema,
          currentTemplate: document.template,
          formData: document.data,
          validationErrors: {},
          isDirty: false,
        });
      },
      
      exportDocument: (format: ExportOptions['format']) => {
        const state = get();
        const options = { ...state.exportOptions, format };
        set({ exportOptions: options });
        
        // Export logic will be implemented in the export service
        console.log('Exporting document:', state.currentDocument, 'as', format);
      },
      
      setShowPreview: (show: boolean) => {
        set({ showPreview: show });
      },
      
      setPreviewFormat: (format: 'json' | 'json-ld' | 'xml' | 'turtle') => {
        set({ previewFormat: format });
      },
      
      resetForm: () => {
        set({
          formData: {},
          validationErrors: {},
          isDirty: false,
          currentDocument: undefined,
        });
      },
      
      // Field ordering actions
      reorderField: (fieldId: string, newIndex: number) => {
        const state = get();
        const schemaKey = `${state.currentSchema}-${state.currentTemplate || 'default'}`;
        
        // Get all fields in their current order
        const schemaDef = schemas[state.currentSchema as keyof typeof schemas];
        const templateFields = [...schemaDef.fields];
        const userCustomFields = state.customFields[schemaKey] || [];
        const allFields = [...templateFields, ...userCustomFields];
        
        // Get current field order from the store
        const currentOrder = state.fieldOrder[schemaKey] || {};
        
        // Create a list of all fields with their current positions
        const fieldsWithOrder = allFields.map(field => ({
          field,
          order: currentOrder[field.id] !== undefined ? currentOrder[field.id] : field.order ?? 999
        }));
        
        // Sort by current order
        fieldsWithOrder.sort((a, b) => a.order - b.order);
        
        // Find the field being moved
        const fieldIndex = fieldsWithOrder.findIndex(item => item.field.id === fieldId);
        if (fieldIndex === -1) return;
        
        // Remove the field from its current position
        const [movedField] = fieldsWithOrder.splice(fieldIndex, 1);
        
        // Insert it at the new position
        fieldsWithOrder.splice(newIndex, 0, movedField);
        
        // Create new order mapping with sequential indices
        const newOrder: Record<string, number> = {};
        fieldsWithOrder.forEach((item, index) => {
          newOrder[item.field.id] = index;
        });
        
        set({
          fieldOrder: {
            ...state.fieldOrder,
            [schemaKey]: newOrder
          },
          isDirty: true
        });
      },
      
      addCustomField: (field: CustomFieldDefinition) => {
        const state = get();
        const schemaKey = `${state.currentSchema}-${state.currentTemplate || 'default'}`;
        
        set({
          customFields: {
            ...state.customFields,
            [schemaKey]: [...(state.customFields[schemaKey] || []), field]
          },
          isDirty: true
        });
      },
      
      removeCustomField: (fieldId: string) => {
        const state = get();
        const schemaKey = `${state.currentSchema}-${state.currentTemplate || 'default'}`;
        
        set({
          customFields: {
            ...state.customFields,
            [schemaKey]: (state.customFields[schemaKey] || []).filter(field => field.id !== fieldId)
          },
          isDirty: true
        });
      },
      
      reorderArrayItem: (fieldId: string, itemId: string, newOrder: number) => {
        const state = get();
        
        set({
          arrayItemOrders: {
            ...state.arrayItemOrders,
            [fieldId]: {
              ...state.arrayItemOrders[fieldId],
              [itemId]: newOrder
            }
          },
          isDirty: true
        });
      },
      
      resetToTemplateOrder: () => {
        const state = get();
        const schemaKey = `${state.currentSchema}-${state.currentTemplate || 'default'}`;
        
        set({
          fieldOrder: {
            ...state.fieldOrder,
            [schemaKey]: {}
          },
          customFields: {
            ...state.customFields,
            [schemaKey]: []
          },
          arrayItemOrders: {},
          isDirty: true
        });
      },
    }),
    {
      name: 'schemeweave-store',
      partialize: (state) => ({
        fieldOrder: state.fieldOrder,
        customFields: state.customFields,
        arrayItemOrders: state.arrayItemOrders,
        currentSchema: state.currentSchema,
        currentTemplate: state.currentTemplate,
      }),
    }
  )
);
