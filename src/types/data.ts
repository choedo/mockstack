import type { MOCK_DATA_ITEMS, MOCK_DB_DIALECT } from '@/data/mock';
import type { Database } from '@/database.types';
import type {
  NumberOptions,
  DateOptions,
  EnumOptions,
  PrimaryOptions,
  BooleanOptions,
  NameOptions,
  EmailOptions,
  AddressOptions,
  ContactOptions,
  AccountOptions,
  HobbyOptions,
  StringOptions,
} from '@/types/columns';

export type ProfileEntity = Database['public']['Tables']['profile']['Row'];
export type ProjectEntity = Database['public']['Tables']['project']['Row'];
export type TableEntity = Database['public']['Tables']['table']['Row'];
export type ColumnEntity = Database['public']['Tables']['column']['Row'] & {
  column_values: ColumnOptions;
  column_type: ColumnTypes;
};

export type MockDataType = (typeof MOCK_DATA_ITEMS)[number];
export type DBDialect = (typeof MOCK_DB_DIALECT)[number];

export type TableAndColumn = TableEntity & {
  columns: ColumnEntity[];
};
export type ColumnDefaultTypes =
  | 'pk'
  | 'date'
  | 'enum'
  | 'number'
  | 'string'
  | 'boolean';
export type ColumnCustomTypes =
  | 'name'
  | 'email'
  | 'address'
  | 'contact'
  | 'account'
  | 'hobby';
export type ColumnTypes = ColumnDefaultTypes | ColumnCustomTypes;

export type ColumnDefaultOptions =
  | NumberOptions
  | StringOptions
  | DateOptions
  | EnumOptions
  | PrimaryOptions
  | BooleanOptions;
export type ColumnCustomOptions =
  | NameOptions
  | EmailOptions
  | AddressOptions
  | ContactOptions
  | AccountOptions
  | HobbyOptions;
export type ColumnOptions = ColumnDefaultOptions | ColumnCustomOptions;
