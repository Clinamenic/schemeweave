import { SchemaDefinition } from '../types';

export const doapSchema: SchemaDefinition = {
  name: 'DOAP',
  namespace: 'http://usefulinc.com/ns/doap#',
  version: '1.0',
  fields: [
    {
      id: 'name',
      label: 'Project Name',
      type: 'string',
      required: true,
      description: 'The name of the software project',
      helpText: 'Enter the official name of your software project',
      validation: [
        { type: 'required', message: 'Project name is required' },
        { type: 'minLength', value: 1, message: 'Project name must be at least 1 character' }
      ]
    },
    {
      id: 'description',
      label: 'Description',
      type: 'string',
      required: true,
      description: 'A description of the software project',
      helpText: 'Provide a clear description of what your project does',
      validation: [
        { type: 'required', message: 'Description is required' },
        { type: 'minLength', value: 10, message: 'Description must be at least 10 characters' }
      ]
    },
    {
      id: 'version',
      label: 'Version',
      type: 'string',
      required: true,
      description: 'The current version of the software',
      helpText: 'Use semantic versioning (e.g., 1.0.0)',
      validation: [
        { type: 'required', message: 'Version is required' },
        { type: 'pattern', value: '^\\d+\\.\\d+\\.\\d+', message: 'Version must follow semantic versioning format' }
      ]
    },
    {
      id: 'author',
      label: 'Author',
      type: 'object',
      required: true,
      description: 'The author of the software project',
      helpText: 'Information about the project author',
      nestedFields: [
        {
          id: 'name',
          label: 'Author Name',
          type: 'string',
          required: true,
          description: 'Full name of the author',
          helpText: 'Enter the author\'s full name',
          validation: [{ type: 'required', message: 'Author name is required' }]
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          required: false,
          description: 'Author\'s email address',
          helpText: 'Enter a valid email address',
          validation: [{ type: 'email', message: 'Please enter a valid email address' }]
        },
        {
          id: 'url',
          label: 'URL',
          type: 'url',
          required: false,
          description: 'Author\'s website or profile URL',
          helpText: 'Enter a valid URL',
          validation: [{ type: 'url', message: 'Please enter a valid URL' }]
        }
      ]
    },
    {
      id: 'license',
      label: 'License',
      type: 'url',
      required: false,
      description: 'The license under which the software is distributed',
      helpText: 'URL to the license (e.g., https://opensource.org/licenses/MIT)',
      validation: [{ type: 'url', message: 'Please enter a valid license URL' }]
    },
    {
      id: 'homepage',
      label: 'Homepage',
      type: 'url',
      required: false,
      description: 'The homepage of the software project',
      helpText: 'URL to the project\'s main website',
      validation: [{ type: 'url', message: 'Please enter a valid homepage URL' }]
    },
    {
      id: 'repository',
      label: 'Repository',
      type: 'object',
      required: false,
      description: 'Source code repository information',
      helpText: 'Details about where the source code is hosted',
      nestedFields: [
        {
          id: 'url',
          label: 'Repository URL',
          type: 'url',
          required: true,
          description: 'URL to the source code repository',
          helpText: 'Enter the repository URL (e.g., GitHub, GitLab)',
          validation: [{ type: 'url', message: 'Please enter a valid repository URL' }]
        },
        {
          id: 'programmingLanguage',
          label: 'Primary Language',
          type: 'string',
          required: false,
          description: 'Primary programming language used',
          helpText: 'Main programming language (e.g., TypeScript, Python)'
        }
      ]
    },
    {
      id: 'keywords',
      label: 'Keywords',
      type: 'array',
      required: false,
      description: 'Keywords describing the project',
      helpText: 'Add relevant keywords to help categorize your project'
    },
    {
      id: 'featureList',
      label: 'Features',
      type: 'array',
      required: false,
      description: 'List of key features',
      helpText: 'Describe the main features of your project'
    }
  ],
  templates: [
    {
      id: 'software-project',
      name: 'Software Project',
      description: 'A general software project template',
      defaultValues: {
        name: '',
        description: '',
        version: '0.1.0',
        author: {
          name: '',
          email: '',
          url: ''
        },
        license: 'https://opensource.org/licenses/MIT',
        keywords: [],
        featureList: []
      }
    },
    {
      id: 'web-application',
      name: 'Web Application',
      description: 'Template for web applications',
      defaultValues: {
        name: '',
        description: '',
        version: '0.1.0',
        author: {
          name: '',
          email: '',
          url: ''
        },
        license: 'https://opensource.org/licenses/MIT',
        homepage: '',
        repository: {
          url: '',
          programmingLanguage: 'TypeScript'
        },
        keywords: ['web', 'application', 'client-side'],
        featureList: []
      }
    }
  ]
};

export const foafSchema: SchemaDefinition = {
  name: 'FOAF',
  namespace: 'http://xmlns.com/foaf/0.1/',
  version: '1.0',
  fields: [
    {
      id: 'name',
      label: 'Name',
      type: 'string',
      required: true,
      description: 'The name of the person',
      helpText: 'Enter your full name',
      validation: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 1, message: 'Name must be at least 1 character' }
      ]
    },
    {
      id: 'mbox',
      label: 'Email',
      type: 'email',
      required: false,
      description: 'Email address',
      helpText: 'Enter your email address',
      validation: [{ type: 'email', message: 'Please enter a valid email address' }]
    },
    {
      id: 'homepage',
      label: 'Homepage',
      type: 'url',
      required: false,
      description: 'Personal homepage or website',
      helpText: 'URL to your personal website or homepage',
      validation: [{ type: 'url', message: 'Please enter a valid URL' }]
    },
    {
      id: 'knows',
      label: 'Known People',
      type: 'array',
      required: false,
      description: 'People you know',
      helpText: 'Add people you know or work with'
    },
    {
      id: 'interest',
      label: 'Interests',
      type: 'array',
      required: false,
      description: 'Your interests and hobbies',
      helpText: 'List your interests, hobbies, or areas of expertise'
    },
    {
      id: 'currentProject',
      label: 'Current Projects',
      type: 'array',
      required: false,
      description: 'Projects you are currently working on',
      helpText: 'List your current projects or work'
    },
    {
      id: 'workplaceHomepage',
      label: 'Workplace Homepage',
      type: 'url',
      required: false,
      description: 'Your workplace or company website',
      helpText: 'URL to your workplace or company website',
      validation: [{ type: 'url', message: 'Please enter a valid URL' }]
    },
    {
      id: 'schoolHomepage',
      label: 'School Homepage',
      type: 'url',
      required: false,
      description: 'Your school or university website',
      helpText: 'URL to your school or university website',
      validation: [{ type: 'url', message: 'Please enter a valid URL' }]
    }
  ],
  templates: [
    {
      id: 'personal-profile',
      name: 'Personal Profile',
      description: 'A personal profile template',
      defaultValues: {
        name: '',
        mbox: '',
        homepage: '',
        knows: [],
        interest: [],
        currentProject: []
      }
    },
    {
      id: 'professional-profile',
      name: 'Professional Profile',
      description: 'A professional profile template',
      defaultValues: {
        name: '',
        mbox: '',
        homepage: '',
        workplaceHomepage: '',
        knows: [],
        interest: [],
        currentProject: []
      }
    }
  ]
};

export const schemas = {
  doap: doapSchema,
  foaf: foafSchema
};
