import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SchemaField } from '../types';

interface SortableFieldProps {
  field: SchemaField;
  children: React.ReactNode;
}

export const SortableField: React.FC<SortableFieldProps> = ({ 
  field, 
  children
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`sortable-field ${isDragging ? 'dragging' : ''}`}
    >
      <div className="field-container">
        {children}
        
        {/* Drag Handle */}
        <div 
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        />
      </div>
    </div>
  );
};
