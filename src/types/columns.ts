import type { ColumnDefaultTypes, ColumnCustomTypes } from '@/types/data';
import type { Language } from '@/types/default';

/**
 * SECTION: 컬럼 옵션 기본 타입 정의
 */
// 1. 숫자형 (Number) 옵션
export interface NumberOptions {
  type: Extract<ColumnDefaultTypes, 'number'>;
  min?: number;
  max?: number;
  precision?: number; // 소수점 자릿수
}

// 2. 날짜형 (Date) 옵션
export interface DateOptions {
  type: Extract<ColumnDefaultTypes, 'date'>;
  valueType: 'unix' | 'date';
  startDate?: Date;
  endDate?: Date;
  format?: string;
}

// 3. 열거형 (Enum) 옵션
export interface EnumOptions {
  type: Extract<ColumnDefaultTypes, 'enum'>;
  values: string[];
}

// 4. PK (Primary Key) 옵션
export type PrimaryUUIDOptions = {
  valueType: 'uuid';
};
export type PrimaryNumberOptions = {
  valueType: 'number';
  min: number;
};
export type PrimaryOptions = { type: Extract<ColumnDefaultTypes, 'pk'> } & (
  | PrimaryUUIDOptions
  | PrimaryNumberOptions
);

// 5. Boolean 옵션
export interface BooleanOptions {
  type: Extract<ColumnDefaultTypes, 'boolean'>;
  valueType: 'boolean' | 'number';
}
/**!SECTION */

/**
 * SECTION: 컬럼 옵션 커스텀 타입 정의
 */
// 1. 이름 (Name) 옵션
export type NameValueType = 'firstName' | 'lastName' | 'fullName';
export interface NameOptions {
  type: Extract<ColumnCustomTypes, 'name'>;
  valueType: NameValueType;
  language: Language;
}

// 2. 이메일 (Email) 옵션
export interface EmailOptions {
  type: Extract<ColumnCustomTypes, 'email'>;
}

// 3. 주소 (Address) 옵션
export type AddressValueType =
  | 'fullAddress'
  | 'fullStreetAddress'
  | 'mainAddress'
  | 'mainStreetAddress'
  | 'detailAddress'
  | 'siDo'
  | 'siGunGu'
  | 'eupMyeonDong'
  | 'roadName';
export interface AddressOptions {
  type: Extract<ColumnCustomTypes, 'address'>;
  valueType: AddressValueType;
  // language: Language;
  language: 'ko';
}

// 4. 연락처 (Contact) 옵션
export type ContactValueType = 'mobile' | 'homePhone';
export interface ContactOptions {
  type: Extract<ColumnCustomTypes, 'contact'>;
  valueType: ContactValueType;
  format?: string;
}

// 5. 계정 (Account) 옵션
export interface AccountOptions {
  type: Extract<ColumnCustomTypes, 'account'>;
}

// 6. 취미 (Hobby) 옵션
export interface HobbyOptions {
  type: Extract<ColumnCustomTypes, 'hobby'>;
  language: Language;
}
/**!SECTION */
