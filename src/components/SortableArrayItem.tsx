import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableArrayItemProps {
  id: string;
  value: string;
  children: React.ReactNode;
}

export const SortableArrayItem: React.FC<SortableArrayItemProps> = ({ 
  id, 
  value, 
  children 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`sortable-array-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="array-item-container">
        {children}
        
        {/* Drag Handle */}
        <div 
          className="array-item-drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="currentColor"
            className="array-drag-icon"
          >
            <circle cx="2" cy="2" r="1"/>
            <circle cx="6" cy="2" r="1"/>
            <circle cx="2" cy="6" r="1"/>
            <circle cx="6" cy="6" r="1"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
