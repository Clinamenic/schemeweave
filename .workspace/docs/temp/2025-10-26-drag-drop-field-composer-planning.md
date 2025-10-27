# Drag and Drop Field Composer Implementation Plan

**Document ID:** 2025-10-26-drag-drop-field-composer-planning  
**Created:** 2025-10-26T20:59:21Z  
**Status:** Planning Phase  
**Project:** Schemeweave

## Executive Summary

This document outlines the implementation plan for adding comprehensive drag and drop functionality to the Schemeweave document composer. The enhancement will enable users to reorder fields, add custom fields, manage array items, and maintain template-specific field locking while preserving the semantic document structure.

## Baseline Knowledge

### Current Architecture

**Core Components:**

- `DocumentForm.tsx`: Main form component rendering fields based on schema
- `schemas.ts`: Schema definitions for DOAP and FOAF with field specifications
- `useAppStore.ts`: Zustand store managing form state and document data
- `types/index.ts`: TypeScript interfaces for schemas, fields, and documents

**Current Field Types:**

- `string`: Text input fields
- `email`: Email validation input
- `url`: URL validation input
- `array`: TagInput component for list management
- `object`: Nested field groups with sub-fields

**Current Field Structure:**

```typescript
interface SchemaField {
  id: string;
  label: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "url" | "email";
  required: boolean;
  description: string;
  helpText: string;
  validation?: ValidationRule[];
  nestedFields?: SchemaField[];
}
```

**Required File Modifications:**

- `src/components/DocumentForm.tsx` - Main form component
- `src/types/index.ts` - Extended field interfaces
- `src/stores/useAppStore.ts` - State management updates
- `src/services/schemas.ts` - Schema field ordering support
- `src/styles/` - Drag and drop styling

## Type Definitions

### New Interfaces

```typescript
// Extended field interface with ordering and locking
interface ExtendedSchemaField extends SchemaField {
  order: number;
  locked: boolean;
  isCustom: boolean;
  dragHandleId: string;
}

// Custom field creation interface
interface CustomFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  description: string;
  helpText: string;
  order: number;
  isCustom: true;
}

// Array item management interface
interface ArrayItem {
  id: string;
  value: string;
  order: number;
}

// Drag and drop event interfaces
interface FieldReorderEvent {
  fieldId: string;
  oldOrder: number;
  newOrder: number;
}

interface ArrayItemReorderEvent {
  fieldId: string;
  itemId: string;
  oldOrder: number;
  newOrder: number;
}
```

### Extended Store Interface

```typescript
interface AppStore extends FormState {
  // Existing properties...

  // Field ordering and management
  fieldOrder: Record<string, number>; // schema -> field order mapping
  customFields: Record<string, CustomFieldDefinition[]>; // schema -> custom fields
  arrayItemOrders: Record<string, Record<string, number>>; // fieldId -> itemId -> order

  // Actions
  reorderField: (fieldId: string, newOrder: number) => void;
  addCustomField: (field: CustomFieldDefinition) => void;
  removeCustomField: (fieldId: string) => void;
  reorderArrayItem: (fieldId: string, itemId: string, newOrder: number) => void;
  resetToTemplateOrder: () => void;
}
```

## Implementation Order

### Phase 1: Core Drag and Drop Infrastructure

1. **Install Dependencies**

   - Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
   - Configure drag and drop context providers

2. **Extend Type System**

   - Update `SchemaField` interface with ordering properties
   - Add custom field and array item management types
   - Extend store interface with new actions

3. **Update Store Implementation**
   - Add field ordering state management
   - Implement custom field CRUD operations
   - Add array item reordering logic

### Phase 2: Field-Level Drag and Drop

1. **Create Sortable Field Component**

   - Implement `SortableField` wrapper component
   - Add drag handle with visual indicators
   - Implement locked field styling (red handle)

2. **Update DocumentForm Component**

   - Wrap fields in `DndContext` and `SortableContext`
   - Implement field reordering logic
   - Add visual feedback during drag operations

3. **Custom Field Management**
   - Add "Add Custom Field" button and modal
   - Implement custom field creation form
   - Add field removal functionality

### Phase 3: Array Item Management

1. **Create Sortable Array Items**

   - Implement `SortableArrayItem` component
   - Add drag handles to individual array items
   - Implement item reordering within arrays

2. **Update TagInput Component**
   - Integrate drag and drop for array items
   - Add visual indicators for drag operations
   - Maintain existing add/remove functionality

### Phase 4: Template Integration

1. **Template-Specific Ordering**

   - Implement template-based field ordering
   - Add field locking based on template requirements
   - Create "Reset to Template Order" functionality

2. **Document Export Integration**
   - Ensure field order affects document preview
   - Update export logic to respect field ordering
   - Maintain semantic structure in output

## Integration Points

### Dependencies

- **@dnd-kit/core**: Core drag and drop functionality
- **@dnd-kit/sortable**: Sortable list management
- **@dnd-kit/utilities**: CSS utilities for drag animations

### API Integration

- **Form State Management**: Extended Zustand store with field ordering
- **Schema Service**: Enhanced schema definitions with ordering metadata
- **Export Service**: Updated to respect field order in document output

### Event Handling

- **Field Reordering**: `onDragEnd` events updating field order
- **Array Item Reordering**: Item-level drag events within arrays
- **Custom Field Management**: CRUD operations for user-defined fields

### Error Handling

- **Validation**: Maintain existing field validation during reordering
- **State Consistency**: Ensure field order changes don't break form state
- **Template Constraints**: Prevent invalid field operations on locked fields

## Success Criteria

### Functionality

- ✅ Users can drag and drop fields to reorder them
- ✅ Locked fields (required fields in templates) cannot be moved
- ✅ Visual indicators clearly show draggable vs locked fields
- ✅ Custom fields can be added with all supported field types
- ✅ Array items can be reordered within their respective fields
- ✅ Field order directly affects document preview and export
- ✅ "Reset to Template Order" restores original field arrangement

### Performance

- ✅ Drag operations are smooth with minimal lag
- ✅ Large field lists scroll smoothly during drag operations
- ✅ State updates don't cause unnecessary re-renders

### Reliability

- ✅ Field reordering doesn't break existing validation
- ✅ Custom fields integrate seamlessly with existing field types
- ✅ Template switching preserves appropriate field locking
- ✅ Document export maintains correct field order

## Risk & Rollback

### Identified Risks

1. **State Complexity**: Adding field ordering may complicate state management
2. **Performance Impact**: Drag and drop operations on large field lists
3. **Accessibility**: Ensuring keyboard navigation works with drag and drop
4. **Template Compatibility**: Maintaining backward compatibility with existing templates

### Mitigation Strategies

1. **Incremental Implementation**: Build and test each phase independently
2. **Performance Optimization**: Use React.memo and useCallback for expensive operations
3. **Accessibility Testing**: Ensure keyboard navigation and screen reader compatibility
4. **Backward Compatibility**: Maintain existing schema structure with optional ordering

### Rollback Plan

- **Phase 1-2**: Remove drag and drop dependencies, revert to static field rendering
- **Phase 3**: Disable array item reordering, maintain static array display
- **Phase 4**: Remove custom field functionality, restore template-only fields

## Implementation Notes

### Visual Design

- **Drag Handle**: Small grip icon on the right side of each field
- **Locked Fields**: Red-colored drag handle with disabled cursor
- **Drag Feedback**: Theme-colored border around dragged elements
- **Drop Zones**: Subtle highlighting of valid drop areas

### Accessibility Considerations

- **Keyboard Navigation**: Arrow keys for field reordering
- **Screen Reader Support**: Proper ARIA labels for drag handles
- **Focus Management**: Maintain focus during drag operations

### Template-Specific Requirements

- **DOAP Template**: Lock "name", "description", "version" fields
- **FOAF Template**: Lock "name" field
- **Custom Templates**: Configurable field locking per template

---

**Next Steps**: Await user confirmation before proceeding to implementation phase.
