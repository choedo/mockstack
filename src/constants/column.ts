import type {
  AddressValueType,
  NameValueType,
  ContactValueType,
} from '@/types/columns';
import type { ColumnCustomTypes, ColumnDefaultTypes } from '@/types/data';

type DefaultValues = { title: string; value: ColumnDefaultTypes };
type DefaultKeyValues = Record<ColumnDefaultTypes, DefaultValues>;

type CustomValues = { title: string; value: ColumnCustomTypes };
type CustomKeyValues = Record<ColumnCustomTypes, CustomValues>;

export const DEFAULT_COLUMN_TYPES: DefaultKeyValues = {
  pk: {
    title: 'Primary Key',
    value: 'pk',
  },
  date: {
    title: 'Date',
    value: 'date',
  },
  enum: {
    title: 'Enum',
    value: 'enum',
  },
  number: {
    title: 'Number',
    value: 'number',
  },
  string: {
    title: 'String',
    value: 'string',
  },
  boolean: {
    title: 'Boolean',
    value: 'boolean',
  },
};

export const CUSTOM_COLUMN_TYPES: CustomKeyValues = {
  name: {
    title: 'Name',
    value: 'name',
  },
  email: {
    title: 'Email',
    value: 'email',
  },
  address: {
    title: 'Address',
    value: 'address',
  },
  contact: {
    title: 'Contact',
    value: 'contact',
  },
  account: {
    title: 'Account',
    value: 'account',
  },
  hobby: {
    title: 'Hobby',
    value: 'hobby',
  },
};

export const COLUMN_TYPES = { ...DEFAULT_COLUMN_TYPES, ...CUSTOM_COLUMN_TYPES };

export const MINIMUM_DATE = '1926-01-01';
export const MAXIMUM_DATE = '2099-12-31';

type NameOptionKeyValues = Record<
  NameValueType,
  { title: string; value: NameValueType }
>;
export const NAME_COLUMN_OPTION_VALUE_TYPES: NameOptionKeyValues = {
  firstName: { title: 'First Name', value: 'firstName' },
  lastName: { title: 'Last Name', value: 'lastName' },
  fullName: { title: 'Full Name', value: 'fullName' },
};

type AddressOptionKeyValues = Record<
  AddressValueType,
  { title: string; value: AddressValueType }
>;
export const ADDRESS_COLUMN_OPTION_VALUE_TYPES: AddressOptionKeyValues = {
  fullAddress: { title: 'Full Address', value: 'fullAddress' },
  fullStreetAddress: {
    title: 'Full Street Address',
    value: 'fullStreetAddress',
  },
  mainAddress: { title: 'Main Address', value: 'mainAddress' },
  mainStreetAddress: {
    title: 'Main Street Address',
    value: 'mainStreetAddress',
  },
  detailAddress: { title: 'Detail Address', value: 'detailAddress' },
  siDo: { title: 'Si/Do', value: 'siDo' },
  siGunGu: { title: 'Si/Gun/Gu', value: 'siGunGu' },
  eupMyeonDong: { title: 'Eup/Myeon/Dong', value: 'eupMyeonDong' },
  roadName: { title: 'Road Name', value: 'roadName' },
};

type ContactOptionKeyValues = Record<
  ContactValueType,
  { title: string; value: ContactValueType }
>;
export const CONTACT_COLUMN_OPTION_VALUE_TYPES: ContactOptionKeyValues = {
  mobile: { title: 'Mobile', value: 'mobile' },
  homePhone: { title: 'Home Phone', value: 'homePhone' },
};
