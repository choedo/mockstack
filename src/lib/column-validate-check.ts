import { MAXIMUM_DATE, MINIMUM_DATE } from '@/constants/column';
import { AlertMessages } from '@/languages/alert-messages';
import type {
  BooleanOptions,
  DateOptions,
  EnumOptions,
  NumberOptions,
  PrimaryOptions,
  StringOptions,
} from '@/types/columns';
import type { ColumnOptions } from '@/types/data';
import type { Language } from '@/types/default';
import dayjs from 'dayjs';

type MessageType = Record<Language, string>;
type FailReturnType = { status: 'Fail'; message: MessageType };
type SuccessReturnType = {
  status: 'Success';
  data: ColumnOptions;
  message: MessageType;
};
type ReturnType = FailReturnType | SuccessReturnType;

export function columnValidateCheck(options: ColumnOptions): ReturnType {
  const optionsType = options.type;

  switch (optionsType) {
    case 'pk':
      return primaryValidateCheck(options);
    case 'date':
      return dateValidateCheck(options);
    case 'number':
      return numberValidateCheck(options);
    case 'string':
      return stringValidateCheck(options);
    case 'enum':
      return enumValidateCheck(options);
    case 'boolean':
      return booleanValidateCheck(options);
    case 'name':
    case 'email':
    case 'address':
    case 'contact':
    case 'account':
    case 'hobby':
      return {
        status: 'Success',
        message: AlertMessages.SUCCESS,
        data: options,
      };
    default:
      return { status: 'Fail', message: AlertMessages.DEFAULT_FAIL_MESSAGE };
  }
}

// Primary Key Type
function primaryValidateCheck(options: PrimaryOptions): ReturnType {
  const primaryValueType = options.valueType;

  if (primaryValueType === 'uuid') {
    return { status: 'Success', message: AlertMessages.SUCCESS, data: options };
  } else {
    const { min } = options;

    if (!min) {
      return {
        status: 'Fail',
        message: AlertMessages.INPUT_MINIMUM_VALUE,
      };
    }

    return { status: 'Success', message: AlertMessages.SUCCESS, data: options };
  }
}

// Date Type
function dateValidateCheck(options: DateOptions): ReturnType {
  const { type, startDate, endDate, format, valueType } = options;
  if (startDate && endDate) {
    if (!dayjs(startDate).isBefore(endDate)) {
      return {
        status: 'Fail',
        message: AlertMessages.MINIMUM_DATE_GREATER_MAXIMUM_DATE,
      };
    }
  }

  return {
    status: 'Success',
    message: AlertMessages.SUCCESS,
    data: {
      type,
      valueType,
      format: format || 'YYYY-MM-DD',
      startDate: startDate || new Date(MINIMUM_DATE),
      endDate: endDate || new Date(MAXIMUM_DATE),
    },
  };
}

// Number Type
function numberValidateCheck(options: NumberOptions): ReturnType {
  const { type, min, max, precision } = options;

  if (min && max) {
    if (Number(min) >= Number(max)) {
      return {
        status: 'Fail',
        message: AlertMessages.MINIMUM_GREATER_MAXIMUM,
      };
    }
  }

  return {
    status: 'Success',
    message: AlertMessages.SUCCESS,
    data: {
      type,
      min: min || 0,
      max: max || Infinity,
      precision: precision || 0,
    },
  };
}

// String Type
function stringValidateCheck(options: StringOptions): ReturnType {
  const { type, min, max } = options;

  if (min && max) {
    if (Number(min) >= Number(max)) {
      return {
        status: 'Fail',
        message: AlertMessages.MINIMUM_GREATER_MAXIMUM,
      };
    }
  }

  return {
    status: 'Success',
    message: AlertMessages.SUCCESS,
    data: {
      type,
      min: min || 1,
      max: max || 255,
    },
  };
}

// Enum Type
function enumValidateCheck(options: EnumOptions): ReturnType {
  if (options.values.length === 0) {
    return {
      status: 'Fail',
      message: AlertMessages.REQUIRED_ONE_OPTION_VALUE,
    };
  }

  return {
    status: 'Success',
    message: AlertMessages.SUCCESS,
    data: options,
  };
}

// Boolean Type
function booleanValidateCheck(options: BooleanOptions): ReturnType {
  if (!options.valueType) {
    return {
      status: 'Fail',
      message: AlertMessages.SELECT_COLUMN_OPTION_TYPE,
    };
  }

  return {
    status: 'Success',
    message: AlertMessages.SUCCESS,
    data: options,
  };
}
