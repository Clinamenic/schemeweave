// Core schema interfaces
export interface SchemaDefinition {
  name: string;
  namespace: string;
  version: string;
  fields: SchemaField[];
  templates: SchemaTemplate[];
}

export interface SchemaField {
  id: string;
  label: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "url" | "email";
  required: boolean;
  description: string;
  helpText: string;
  validation?: ValidationRule[];
  nestedFields?: SchemaField[];
  order?: number;
  locked?: boolean;
  isCustom?: boolean;
  dragHandleId?: string;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  defaultValues: Record<string, any>;
}

export interface ValidationRule {
  type: "minLength" | "maxLength" | "pattern" | "required" | "email" | "url";
  value?: any;
  message: string;
}

// Document instance
export interface DocumentInstance {
  schema: string;
  template?: string;
  data: Record<string, any>;
  metadata: {
    created: string;
    modified: string;
    version: string;
  };
}

// Form state management
export interface FormState {
  currentSchema: string;
  currentTemplate?: string;
  formData: Record<string, any>;
  validationErrors: Record<string, string[]>;
  isDirty: boolean;
  lastSaved?: string;
}

export interface ExportOptions {
  format: "json" | "json-ld" | "xml" | "turtle";
  pretty: boolean;
  includeMetadata: boolean;
}

// DOAP Schema Types
export interface DoapDocument {
  "@context": string[];
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  version: string;
  author: Person;
  maintainer?: Person;
  repository?: Repository;
  license?: string;
  homepage?: string;
  issueTracker?: string;
  documentation?: string;
  keywords?: string[];
  featureList?: string[];
  softwareRequirements?: SoftwareRequirement[];
  dependencies?: SoftwareDependency[];
  deployments?: Deployment[];
  changelog?: Changelog;
  relatedProjects?: RelatedProject[];
  backupHistory?: BackupRecord[];
}

export interface Person {
  "@type": "Person";
  name: string;
  email?: string;
  url?: string;
}

export interface Repository {
  "@type": "SoftwareSourceCode";
  url: string;
  programmingLanguage: string;
  license: string;
  codeRepository: string;
}

export interface SoftwareRequirement {
  "@type": "SoftwareApplication";
  name: string;
  version: string;
}

export interface SoftwareDependency {
  "@type": "SoftwareApplication";
  name: string;
  version: string;
}

export interface Deployment {
  "@type": "WebSite";
  version: string;
  url: string;
  transactionId: string;
  arweaveUrl: string;
  deploymentDate: string;
  environment: string;
  description: string;
  hostingProvider: string;
}

export interface Changelog {
  "@type": "WebPage";
  url: string;
  description: string;
}

export interface RelatedProject {
  "@type": "SoftwareApplication";
  name: string;
  url: string;
  description: string;
}

export interface BackupRecord {
  "@type": "BackupRecord";
  timestamp: string;
  version: string;
  commitHash: string;
  branch: string;
  arweaveTxId: string;
  fileCount: number;
  totalSize: string;
  backupType: string;
  description: string;
}

// FOAF Schema Types
export interface FoafDocument {
  "@context": string;
  "@type": "Person";
  name: string;
  mbox?: string;
  homepage?: string;
  knows?: Person[];
  based_near?: string;
  workplaceHomepage?: string;
  workInfoHomepage?: string;
  schoolHomepage?: string;
  interest?: string[];
  publications?: string[];
  currentProject?: string[];
  pastProject?: string[];
  weblog?: string;
  openid?: string;
  tipjar?: string;
  made?: string[];
  maker?: string[];
  primaryTopic?: string;
  topic_interest?: string[];
  geekcode?: string;
  dnaChecksum?: string;
  sha1sum?: string;
  plan?: string;
  myersBriggs?: string;
  workplaceHomepage?: string;
  workInfoHomepage?: string;
  schoolHomepage?: string;
  account?: Account[];
  holdsAccount?: Account[];
  accountServiceHomepage?: string;
  jabberID?: string;
  icqChatID?: string;
  msnChatID?: string;
  aimChatID?: string;
  skypeID?: string;
  yahooChatID?: string;
  phone?: string;
  mobile?: string;
  workplaceHomepage?: string;
  workInfoHomepage?: string;
  schoolHomepage?: string;
}

export interface Account {
  "@type": "OnlineAccount";
  accountName: string;
  accountServiceHomepage: string;
}

// Drag and Drop Field Management Types
export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "url" | "email";
  required: boolean;
  description: string;
  helpText: string;
  order: number;
  isCustom: true;
  dragHandleId: string;
}

export interface ArrayItem {
  id: string;
  value: string;
  order: number;
}

export interface FieldReorderEvent {
  fieldId: string;
  oldOrder: number;
  newOrder: number;
}

export interface ArrayItemReorderEvent {
  fieldId: string;
  itemId: string;
  oldOrder: number;
  newOrder: number;
}

export interface ExtendedSchemaField extends SchemaField {
  order: number;
  locked: boolean;
  isCustom: boolean;
  dragHandleId: string;
}
