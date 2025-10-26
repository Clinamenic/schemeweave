import { create } from 'zustand';
import { FormState, DocumentInstance, ExportOptions } from '../types';

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
}

export const useAppStore = create<AppStore>((set, get) => ({
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
}));
