import React from 'react';
import { useAppStore } from '../stores/useAppStore';

export const ExportDialog: React.FC<{ isOpen: boolean; onClose: () => void; format: string }> = ({ 
  isOpen, 
  onClose, 
  format: initialFormat 
}) => {
  const { formData, currentSchema } = useAppStore();
  const [filename, setFilename] = React.useState('');
  const [format, setFormat] = React.useState(initialFormat);

  React.useEffect(() => {
    if (isOpen) {
      const timestamp = new Date().toISOString().split('T')[0];
      setFilename(`${currentSchema}-document-${timestamp}`);
      setFormat(initialFormat);
    }
  }, [isOpen, currentSchema, initialFormat]);

  const generateContent = () => {
    const baseDocument = {
      '@context': currentSchema === 'doap' 
        ? ['https://schema.org/', 'http://usefulinc.com/ns/doap#']
        : 'http://xmlns.com/foaf/0.1/',
      '@type': currentSchema === 'doap' ? 'SoftwareApplication' : 'Person',
      ...formData
    };

    switch (format) {
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

  const handleExport = () => {
    const content = generateContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format === 'json-ld' ? 'json' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onClose();
  };

  const formatOptions = [
    { value: 'json', label: 'JSON', description: 'Standard JSON format' },
    { value: 'json-ld', label: 'JSON-LD', description: 'Linked Data JSON format' },
    { value: 'xml', label: 'XML', description: 'Extensible Markup Language' },
    { value: 'turtle', label: 'Turtle', description: 'RDF Turtle format' }
  ];

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay">
      <div className="export-dialog">
        <div className="dialog-header">
          <h3>Export Document</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="dialog-content">
          <div className="field-group">
            <label>Filename:</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="filename-input"
            />
            <span className="file-extension">.{format === 'json-ld' ? 'json' : format}</span>
          </div>
          
          <div className="field-group">
            <label>Export Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="format-select"
            >
              {formatOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>
          
          <div className="preview-section">
            <label>Preview:</label>
            <pre className="export-preview">
              <code>{generateContent()}</code>
            </pre>
          </div>
        </div>
        
        <div className="dialog-actions">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="export-button" onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
};
