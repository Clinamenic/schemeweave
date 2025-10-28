import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { schemas } from '../services/schemas';

export const PreviewPanel: React.FC = () => {
  const { 
    formData, 
    currentSchema, 
    currentTemplate,
    previewFormat, 
    setPreviewFormat,
    fieldOrder,
    customFields
  } = useAppStore();

  const getOrderedFields = () => {
    if (!currentSchema) {
      return [];
    }
    
    const schemaKey = `${currentSchema}-${currentTemplate || 'default'}`;
    const schemaDef = schemas[currentSchema as keyof typeof schemas];
    const templateFields = [...schemaDef.fields];
    const userCustomFields = customFields[schemaKey] || [];
    
    // Combine template fields and custom fields
    const allFields = [...templateFields, ...userCustomFields];
    
    // Get the field order from the store
    const currentFieldOrder = fieldOrder[schemaKey] || {};
    
    // Sort fields by their order property, using store order if available
    return allFields.sort((a, b) => {
      // Use store order if available, otherwise fall back to field.order
      const orderA = (currentFieldOrder as Record<string, number>)[a.id] !== undefined ? (currentFieldOrder as Record<string, number>)[a.id] : (a.order ?? 999);
      const orderB = (currentFieldOrder as Record<string, number>)[b.id] !== undefined ? (currentFieldOrder as Record<string, number>)[b.id] : (b.order ?? 999);
      return orderA - orderB;
    });
  };

  const generatePreview = () => {
    if (!currentSchema) {
      return 'Select a schema to see preview';
    }
    
    const orderedFields = getOrderedFields();
    
    // Create the base document structure
    const baseDocument = {
      '@context': currentSchema === 'doap' 
        ? ['https://schema.org/', 'http://usefulinc.com/ns/doap#']
        : 'http://xmlns.com/foaf/0.1/',
      '@type': currentSchema === 'doap' 
        ? (formData.projectType || 'SoftwareApplication') 
        : 'Person'
    };

    // Add fields in the correct order
    const orderedData: Record<string, any> = {};
    orderedFields.forEach(field => {
      const value = formData[field.id];
      if (value !== undefined && value !== null && value !== '') {
        // Skip projectType field since it's used for @type
        if (field.id !== 'projectType') {
          orderedData[field.id] = value;
        }
      }
    });

    const finalDocument = { ...baseDocument, ...orderedData };

    switch (previewFormat) {
      case 'json':
        return JSON.stringify(finalDocument, null, 2);
      case 'json-ld':
        return JSON.stringify(finalDocument, null, 2);
      case 'xml':
        return convertToXML(finalDocument);
      case 'turtle':
        return convertToTurtle(finalDocument);
      default:
        return JSON.stringify(finalDocument, null, 2);
    }
  };

  const convertToXML = (obj: any): string => {
    // Simple XML conversion - in a real implementation, you'd use a proper XML library
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<document>\n';
    
    const convertObject = (obj: any, indent = '  '): string => {
      let result = '';
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            result += `${indent}<${key}>${typeof item === 'object' ? '\n' + convertObject(item, indent + '  ') + indent : item}</${key}>\n`;
          });
        } else if (typeof value === 'object' && value !== null) {
          result += `${indent}<${key}>\n${convertObject(value, indent + '  ')}${indent}</${key}>\n`;
        } else {
          result += `${indent}<${key}>${value}</${key}>\n`;
        }
      }
      return result;
    };
    
    xml += convertObject(obj);
    xml += '</document>';
    return xml;
  };

  const convertToTurtle = (obj: any): string => {
    // Simple Turtle conversion - in a real implementation, you'd use a proper RDF library
    let turtle = '@prefix schema: <https://schema.org/> .\n';
    turtle += '@prefix doap: <http://usefulinc.com/ns/doap#> .\n';
    turtle += '@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n\n';
    
    const subject = '<http://example.org/document>';
    turtle += `${subject} a ${obj['@type']} ;\n`;
    
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('@')) continue;
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          turtle += `  ${key} "${item}" ;\n`;
        });
      } else if (typeof value === 'object' && value !== null) {
        turtle += `  ${key} [\n`;
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          turtle += `    ${nestedKey} "${nestedValue}" ;\n`;
        }
        turtle += `  ] ;\n`;
      } else {
        turtle += `  ${key} "${value}" ;\n`;
      }
    }
    
    turtle = turtle.slice(0, -2) + ' .\n';
    return turtle;
  };

  return (
    <div className="preview-panel">
      <div className="terminal-window" id="preview">
        <div className="format-buttons">
          <button 
            className={`format-button ${previewFormat === 'json' ? 'active' : ''}`}
            onClick={() => setPreviewFormat('json')}
          >
            JSON
          </button>
          <button 
            className={`format-button ${previewFormat === 'json-ld' ? 'active' : ''}`}
            onClick={() => setPreviewFormat('json-ld')}
          >
            JSON-LD
          </button>
          <button 
            className={`format-button ${previewFormat === 'xml' ? 'active' : ''}`}
            onClick={() => setPreviewFormat('xml')}
          >
            XML
          </button>
          <button 
            className={`format-button ${previewFormat === 'turtle' ? 'active' : ''}`}
            onClick={() => setPreviewFormat('turtle')}
          >
            Turtle
          </button>
        </div>
        
        <div className="terminal-body">
          <div className="preview-content">
            <pre className="preview-code">
              <code>{generatePreview()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
