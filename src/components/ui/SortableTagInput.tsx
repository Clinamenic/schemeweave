import React, { useState, KeyboardEvent } from 'react';
import { SortableArrayItem } from '../SortableArrayItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enableDragAndDrop?: boolean;
}

export const SortableTagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add keywords...',
  className = '',
  disabled = false,
  enableDragAndDrop = true
}) => {
  const [inputValue, setInputValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    // Add tag when input loses focus if there's content
    if (inputValue.trim()) {
      addTag();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = value.findIndex((_, index) => `tag-${index}` === active.id);
      const newIndex = value.findIndex((_, index) => `tag-${index}` === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTags = [...value];
        const [removed] = newTags.splice(oldIndex, 1);
        newTags.splice(newIndex, 0, removed);
        onChange(newTags);
      }
    }
  };

  const renderTag = (tag: string, index: number) => {
    const tagId = `tag-${index}`;
    
    if (enableDragAndDrop && value.length > 1) {
      return (
        <SortableArrayItem key={tagId} id={tagId} value={tag}>
          <div className="tag-item">
            <span className="tag-text">{tag}</span>
            <button
              type="button"
              className="tag-remove"
              onClick={() => removeTag(index)}
              disabled={disabled}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </div>
        </SortableArrayItem>
      );
    }

    return (
      <div key={tagId} className="tag-item">
        <span className="tag-text">{tag}</span>
        <button
          type="button"
          className="tag-remove"
          onClick={() => removeTag(index)}
          disabled={disabled}
          aria-label={`Remove ${tag}`}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className={`tag-input-container ${className}`}>
      <div className="tag-input-field">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ''}
          className="tag-input"
          disabled={disabled}
        />
      </div>
      {value.length > 0 && (
        <div className="tag-list">
          {enableDragAndDrop && value.length > 1 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={value.map((_, index) => `tag-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                {value.map(renderTag)}
              </SortableContext>
            </DndContext>
          ) : (
            value.map(renderTag)
          )}
        </div>
      )}
    </div>
  );
};
