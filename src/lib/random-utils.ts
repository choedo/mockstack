import { MAXIMUM_DATE } from '@/constants/column';
import {
  COMMON_DONGS,
  DETAIL_ADDRESSES,
  ROAD_NAMES,
  SI_DO,
  SI_GUN_GU,
} from '@/data/address';
import {
  CONTACT_PREFIXES,
  EMAIL_DOMAINS,
  MOBILE_PREFIXES,
} from '@/data/contact';
import {
  ENGLISH_FIRST_NAMES,
  ENGLISH_LAST_NAMES,
  KOREAN_FIRST_NAMES,
  KOREAN_LAST_NAMES,
} from '@/data/name';
import type {
  AddressValueType,
  ContactValueType,
  DateOptions,
  NameValueType,
} from '@/types/columns';
import type { Language } from '@/types/default';
import dayjs from 'dayjs';

export const RandomUtils = {
  getUUID: () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID)
      return crypto.randomUUID();
    else
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
  },
  getInt: (min: number = 0, max: number = Infinity) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  pick: <T>(array: readonly T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  },
  getDate: (options: DateOptions) => {
    const end = new Date(options.endDate || MAXIMUM_DATE);
    const start = new Date(options.startDate || MAXIMUM_DATE);

    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTime);

    if (options.valueType === 'date')
      return dayjs(randomDate).format(options.format);
    else return dayjs(randomDate).unix();
  },
  getRandomName: (valueType: NameValueType, language: Language) => {
    if (language === 'ko') {
      if (valueType === 'firstName') {
        return RandomUtils.pick(KOREAN_FIRST_NAMES);
      } else if (valueType === 'lastName') {
        return RandomUtils.pick(KOREAN_LAST_NAMES);
      } else {
        return `${RandomUtils.pick(KOREAN_LAST_NAMES)}${RandomUtils.pick(KOREAN_FIRST_NAMES)}`;
      }
    } else {
      if (valueType === 'firstName') {
        return RandomUtils.pick(ENGLISH_FIRST_NAMES);
      } else if (valueType === 'lastName') {
        return RandomUtils.pick(ENGLISH_LAST_NAMES);
      } else {
        return `${RandomUtils.pick(ENGLISH_LAST_NAMES)}${RandomUtils.pick(ENGLISH_FIRST_NAMES)}`;
      }
    }
  },
  getRandomAccount: () => {
    return Math.random().toString(36).substring(2, 10);
  },
  getRandomEmail: () => {
    const domains = RandomUtils.pick(EMAIL_DOMAINS);
    const randomStr = RandomUtils.getRandomAccount();
    return `${randomStr}@${domains}`;
  },
  getRandomAddress: (valueType: AddressValueType, language: 'ko') => {
    if (language === 'ko') {
      switch (valueType) {
        case 'fullAddress': {
          const siDo = RandomUtils.pick(SI_DO);
          const siGunGu = RandomUtils.pick(SI_GUN_GU);
          const eupMyeonDong = RandomUtils.pick(COMMON_DONGS);
          const detailAddress = RandomUtils.pick(DETAIL_ADDRESSES);
          return `${siDo} ${siGunGu} ${eupMyeonDong} ${detailAddress}`;
        }
        case 'fullStreetAddress': {
          const siDo = RandomUtils.pick(SI_DO);
          const siGunGu = RandomUtils.pick(SI_GUN_GU);
          const street = RandomUtils.pick(ROAD_NAMES);
          const detailAddress = RandomUtils.pick(DETAIL_ADDRESSES);

          return `${siDo} ${siGunGu} ${street} ${detailAddress}`;
        }
        case 'mainAddress': {
          const siDo = RandomUtils.pick(SI_DO);
          const siGunGu = RandomUtils.pick(SI_GUN_GU);
          const eupMyeonDong = RandomUtils.pick(COMMON_DONGS);
          return `${siDo} ${siGunGu} ${eupMyeonDong}`;
        }
        case 'mainStreetAddress': {
          const siDo = RandomUtils.pick(SI_DO);
          const siGunGu = RandomUtils.pick(SI_GUN_GU);
          const street = RandomUtils.pick(ROAD_NAMES);
          return `${siDo} ${siGunGu} ${street}`;
        }
        case 'detailAddress': {
          return RandomUtils.pick(DETAIL_ADDRESSES);
        }
        case 'siDo': {
          return RandomUtils.pick(SI_DO);
        }
        case 'siGunGu': {
          return RandomUtils.pick(SI_GUN_GU);
        }
        case 'eupMyeonDong': {
          return RandomUtils.pick(COMMON_DONGS);
        }
        case 'roadName': {
          return RandomUtils.pick(ROAD_NAMES);
        }
        default:
          return '';
      }
    } else {
      return '';
    }
  },
  getRandomContact: (valueType: ContactValueType, format: string) => {
    let prefix = '';
    if (valueType === 'mobile') {
      prefix = RandomUtils.pick(MOBILE_PREFIXES);
    } else {
      prefix = RandomUtils.pick(CONTACT_PREFIXES);
    }

    const middleNumber = Math.floor(Math.random() * 9000) + 1000;
    const lastNumber = Math.floor(Math.random() * 9000) + 1000;

    return [prefix, middleNumber, lastNumber].join(format);
  },
};
