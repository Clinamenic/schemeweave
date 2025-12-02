# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-10-27

### Added

- feat(ui): Added favicon support with PNG icon integration
- feat(components): StickyFooter and StickyNavbar components for enhanced navigation
- feat(utils): Version utility for dynamic version display

### Changed

- refactor(ui): Enhanced HTML metadata structure and favicon references
- refactor(styles): Improved CSS architecture with semantic styling approach
- refactor(components): Component restructuring for better maintainability
- refactor(navigation): Replaced NavigationHeader with StickyNavbar for better UX
- refactor(toolbar): Removed Toolbar component in favor of integrated navigation

### Fixed

- fix(ui): Updated favicon references to use correct PNG format
- fix(styles): Enhanced responsive design and component styling

### Deployment

- **Transaction ID**: 7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug
- **URL**: https://arweave.net/7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug
- **Environment**: production
- **Deployment Date**: 2025-10-27T19:45:52-07:00

### Commit Reference

- Release commit: 4d0d064 (2025-10-27T19:45:52-07:00)

## [0.3.0] - 2025-10-27

### Added

- feat(components): AddCustomFieldModal component for creating custom fields with type selection and validation
- feat(components): SortableField component with drag-and-drop reordering capabilities using @dnd-kit
- feat(components): SortableArrayItem component for managing array field items
- feat(ui): SortableTagInput and TagInput components for enhanced tag management
- feat(forms): Enhanced field type support including email, url, number, boolean, array, and object types
- feat(store): Field management and ordering capabilities in useAppStore
- feat(validation): Comprehensive field validation with required field support and help text

### Changed

- refactor(DocumentForm): Improved field organization with drag-and-drop reordering
- refactor(NavigationHeader): Enhanced UI controls and styling for better user experience
- refactor(PreviewPanel): Improved JSON preview with live updates and better formatting
- refactor(schemas): Enhanced schema service with expanded field type support
- refactor(types): Expanded type definitions for custom fields and validation
- refactor(styles): Enhanced CSS utilities and responsive design improvements

### Technical Details

- Updated package dependencies for drag-and-drop functionality (@dnd-kit packages)
- Enhanced form validation with comprehensive field type support
- Improved component architecture with better separation of concerns
- Enhanced styling system with improved utilities and responsive design

### Commit Reference

- Release commit: ba749ed (2025-10-27T12:09:14-07:00)

## [0.2.0] - 2025-10-26

### Added

- feat(app): Initial implementation of Schemeweave semantic document composer
- feat(schemas): DOAP and FOAF schema support with predefined templates
- feat(forms): Form-based interface with real-time validation
- feat(preview): Live JSON preview with instant updates
- feat(export): Multiple export formats (JSON, JSON-LD, XML, Turtle)
- feat(storage): Client-side data persistence with localStorage
- feat(ui): Terminal aesthetic design with responsive layout

### Technical Details

- React 18.2.0 with TypeScript 5.3+
- Zustand for state management
- react-hook-form for form handling
- Zod for schema validation
- Vite build system with Arweave deployment support
