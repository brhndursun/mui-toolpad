import { NodeId, ToolpadComponent } from '@mui/toolpad-core';
import * as appDom from '../../appDom';

export interface ToolpadComponentDefinition {
  displayName: string;
  builtIn?: string;
  system?: boolean;
  codeComponentId?: NodeId;
  synonyms: string[];
  group: string;
  initialProps?: Record<string, unknown>;
}

export type ToolpadComponentDefinitions = Record<string, ToolpadComponentDefinition | undefined>;
export interface InstantiatedComponent extends ToolpadComponentDefinition {
  Component: ToolpadComponent<any>;
}
export type InstantiatedComponents = Record<string, InstantiatedComponent | undefined>;

export const PAGE_ROW_COMPONENT_ID = 'PageRow';
export const PAGE_COLUMN_COMPONENT_ID = 'PageColumn';
export const STACK_COMPONENT_ID = 'Stack';
export const FORM_COMPONENT_ID = 'Form';

export const INTERNAL_COMPONENTS = new Map<string, ToolpadComponentDefinition>([
  [
    PAGE_ROW_COMPONENT_ID,
    { displayName: 'Row', builtIn: 'PageRow', system: true, synonyms: [], group: 'layout' },
  ],
  [
    PAGE_COLUMN_COMPONENT_ID,
    { displayName: 'Column', builtIn: 'PageColumn', system: true, synonyms: [], group: 'layout' },
  ],
  [
    'Autocomplete',
    {
      displayName: 'Autocomplete',
      builtIn: 'Autocomplete',
      synonyms: ['combobox', 'select', 'dropdown'],
      group: 'inputs',
    },
  ],
  [
    'Button',
    {
      displayName: 'Button',
      builtIn: 'Button',
      synonyms: ['click', 'action'],
      group: 'inputs',
    },
  ],
  [
    'ButtonGroup',
    {
      displayName: 'Button Group',
      builtIn: 'ButtonGroup',
      synonyms: ['click', 'action'],
      group: 'inputs',
    },
  ],
  ['Image', { displayName: 'Image', builtIn: 'Image', synonyms: ['picture'], group: 'display' }],
  [
    'DataGrid',
    { displayName: 'Data Grid', builtIn: 'DataGrid', synonyms: ['table'], group: 'display' },
  ],
  [
    'Chart',
    {
      displayName: 'Chart',
      builtIn: 'Chart',
      synonyms: ['graph', 'bar chart', 'pie chart', 'line chart', 'plot'],
      group: 'display',
    },
  ],
  [
    'TextField',
    {
      displayName: 'Text Field',
      builtIn: 'TextField',
      synonyms: ['input', 'field', 'password'],
      group: 'inputs',
    },
  ],
  [
    'DatePicker',
    { displayName: 'Date Picker', builtIn: 'DatePicker', synonyms: ['time'], group: 'inputs' },
  ],
  [
    'FilePicker',
    { displayName: 'File Picker', builtIn: 'FilePicker', synonyms: [], group: 'inputs' },
  ],
  [
    'Text',
    {
      displayName: 'Text',
      builtIn: 'Text',
      synonyms: ['markdown', 'link', 'output'],
      group: 'display',
    },
  ],
  [
    'Markdown',
    {
      displayName: 'Markdown',
      builtIn: 'Text',
      initialProps: {
        mode: 'markdown',
      },
      synonyms: [],
      group: 'display',
    },
  ],
  [
    'Link',
    {
      displayName: 'Link',
      builtIn: 'Text',
      initialProps: {
        mode: 'link',
      },
      synonyms: [],
      group: 'display',
    },
  ],
  [
    'Metric',
    {
      displayName: 'Metric',
      builtIn: 'Metric',
      synonyms: ['value', 'number', 'output'],
      group: 'inputs',
    },
  ],
  [
    'Password',
    {
      displayName: 'Password',
      builtIn: 'TextField',
      synonyms: [],
      initialProps: { password: true },
      group: 'inputs',
    },
  ],
  [
    'Select',
    {
      displayName: 'Select',
      builtIn: 'Select',
      synonyms: ['combobox', 'dropdown'],
      group: 'inputs',
    },
  ],
  ['List', { displayName: 'List', builtIn: 'List', synonyms: ['repeat'], group: 'layout' }],
  ['Paper', { displayName: 'Paper', builtIn: 'Paper', synonyms: ['surface'], group: 'layout' }],
  ['Stack', { displayName: 'Stack', builtIn: 'Stack', synonyms: ['surface'], group: 'layout' }],
  ['Tabs', { displayName: 'Tabs', builtIn: 'Tabs', synonyms: [], group: 'navigation' }],
  ['Container', { displayName: 'Container', builtIn: 'Container', synonyms: [], group: 'layout' }],
  [
    'Checkbox',
    { displayName: 'Checkbox', builtIn: 'Checkbox', synonyms: ['switch'], group: 'inputs' },
  ],
  ['Rating', { displayName: 'Rating', builtIn: 'Rating', synonyms: ['switch'], group: 'inputs' }],
  [
    'RadioGroup',
    { displayName: 'Radio', builtIn: 'RadioGroup', synonyms: ['switch'], group: 'inputs' },
  ],
  [FORM_COMPONENT_ID, { displayName: 'Form', builtIn: 'Form', synonyms: [], group: 'layout' }],
]);

function createCodeComponent(domNode: appDom.CodeComponentNode): ToolpadComponentDefinition {
  return {
    displayName: domNode.name,
    codeComponentId: domNode.id,
    synonyms: [],
    group: '',
  };
}

export function getToolpadComponents(dom: appDom.AppDom): ToolpadComponentDefinitions {
  const app = appDom.getApp(dom);
  const { codeComponents = [] } = appDom.getChildNodes(dom, app);
  return Object.fromEntries([
    ...INTERNAL_COMPONENTS.entries(),
    ...codeComponents.map((codeComponent) => [
      `codeComponent.${codeComponent.name}`,
      createCodeComponent(codeComponent),
    ]),
  ]);
}

export function getToolpadComponent(
  components: ToolpadComponentDefinitions,
  componentId: string,
): ToolpadComponentDefinition | null {
  const component = components[componentId];
  return component || null;
}

export function getElementNodeComponentId(elementNode: appDom.ElementNode): string {
  return elementNode.attributes.component;
}

export function isPageRow(elementNode: appDom.ElementNode): boolean {
  return getElementNodeComponentId(elementNode) === PAGE_ROW_COMPONENT_ID;
}

export function isPageColumn(elementNode: appDom.ElementNode): boolean {
  return getElementNodeComponentId(elementNode) === PAGE_COLUMN_COMPONENT_ID;
}

export function isPageLayoutComponent(elementNode: appDom.ElementNode): boolean {
  return isPageRow(elementNode) || isPageColumn(elementNode);
}

export function isFormComponent(elementNode: appDom.ElementNode): boolean {
  return getElementNodeComponentId(elementNode) === FORM_COMPONENT_ID;
}
