import React from 'react';
import { useAppStore } from '../stores/useAppStore';

export const PreviewPanel: React.FC = () => {
  const { formData, currentSchema, previewFormat, setPreviewFormat } = useAppStore();

  const generatePreview = () => {
    const baseDocument = {
      '@context': currentSchema === 'doap' 
        ? ['https://schema.org/', 'http://usefulinc.com/ns/doap#']
        : 'http://xmlns.com/foaf/0.1/',
      '@type': currentSchema === 'doap' ? 'SoftwareApplication' : 'Person',
      ...formData
    };

    switch (previewFormat) {
      case 'json':
        return JSON.stringify(baseDocument, null, 2);
      case 'json-ld':
        return JSON.stringify(baseDocument, null, 2);
      case 'xml':
        return convertToXML(baseDocument);
      case 'turtle':
        return convertToTurtle(baseDocument);
      default:
        return JSON.stringify(baseDocument, null, 2);
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
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">Preview</div>
          <div className="format-selector">
            <select 
              value={previewFormat} 
              onChange={(e) => setPreviewFormat(e.target.value as any)}
              className="format-select"
            >
              <option value="json">JSON</option>
              <option value="json-ld">JSON-LD</option>
              <option value="xml">XML</option>
              <option value="turtle">Turtle</option>
            </select>
          </div>
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
