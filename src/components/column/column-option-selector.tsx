import React, { type KeyboardEvent } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnOptions, ColumnTypes } from '@/types/data';
import { Input } from '@/components/ui/input';
import type {
  BooleanOptions,
  DateOptions,
  EnumOptions,
  NumberOptions,
  PrimaryOptions,
  NameOptions,
  // EmailOptions,
  AddressOptions,
  ContactOptions,
} from '@/types/columns';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { PlusSquare, XIcon } from 'lucide-react';
import toastMessage from '@/lib/toast-message';
import { inputIntegerValue } from '@/lib/input-value';
import { useLanguage } from '@/store/translation';
import { AlertMessages } from '@/languages/alert-messages';
import { ContentMessages } from '@/languages/content-messages';
import { LANGUAGES } from '@/constants/language';
import {
  ADDRESS_COLUMN_OPTION_VALUE_TYPES,
  CONTACT_COLUMN_OPTION_VALUE_TYPES,
  NAME_COLUMN_OPTION_VALUE_TYPES,
} from '@/constants/column';

type Props = {
  type: ColumnTypes;
  onChange?: (selected: ColumnOptions) => void;
  disabled?: boolean;
  defaultValue?: ColumnOptions;
};

export default function ColumnOptionSelector(props: Props) {
  const language = useLanguage();
  /**
   * Default 옵션
   * --
   * @param {ColumnTypes} type
   * @returns {ColumnOptions}
   */
  const getDefaultOptions = (type: ColumnTypes): ColumnOptions => {
    switch (type) {
      case 'pk':
        return { type: 'pk', valueType: 'uuid' };
      case 'number':
        return { type: 'number' };
      case 'date':
        return { type: 'date', valueType: 'date' };
      case 'enum':
        return { type: 'enum', values: [] };
      case 'boolean':
        return { type: 'boolean', valueType: 'boolean' };
      case 'name': {
        return { type: 'name', valueType: 'fullName', language: language };
      }
      case 'email': {
        return { type: 'email' };
      }
      case 'address': {
        return {
          type: 'address',
          valueType: 'fullAddress',
          // language: language,
          language: 'ko',
        };
      }
      case 'contact': {
        return { type: 'contact', format: '', valueType: 'mobile' };
      }
      default:
        return { type: 'pk', valueType: 'uuid' };
    }
  };

  const [isRender, setIsRender] = React.useState(false);
  const [selected, setSelected] = React.useState(() =>
    props.defaultValue ? props.defaultValue : getDefaultOptions(props.type),
  );
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (props.defaultValue) setSelected(props.defaultValue);

    setIsRender(true);
  }, [props.defaultValue]);

  React.useEffect(() => {
    if (isRender && props.type !== selected.type) {
      const newOptions = getDefaultOptions(props.type);
      setSelected(newOptions);
    }
  }, [props.type, isRender, selected.type]);

  React.useEffect(() => {
    props.onChange?.(selected);
  }, [selected, props.onChange]);

  /**
   * 옵션 변경 핸들러
   * --
   * @param {string} target
   * @param {string | number | Date | undefined | null} value
   * @returns
   */
  const handleSelectedChange = (
    target: string,
    value: string | number | Date | undefined | null,
  ) => {
    setSelected((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  /**
   * 열거형 옵션에 값 추가
   * --
   * @returns
   */
  const handleAddValues = () => {
    if (selected.type !== 'enum') return;

    if (inputValue.trim() === '') {
      toastMessage.info(AlertMessages.REQUIRED_ENUM_OPTION_VALUE[language]);
      return;
    }

    const prevValues = selected.values;

    if (prevValues.includes(inputValue)) {
      toastMessage.info(AlertMessages.DUPLICATE_ENUM_OPTION_VALUE[language]);
      return;
    }

    setSelected((prev) => ({
      ...prev,
      values: [...prevValues, inputValue],
    }));
    setInputValue('');
  };

  /**
   * 열거형 옵션에 값 제거
   * --
   * @param {string} value
   * @returns
   */
  const handleRemoveValues = (value: string) => {
    if (selected.type !== 'enum') return;

    const prevValues = selected.values;
    setSelected((prev) => ({
      ...prev,
      values: prevValues.filter((v) => v !== value),
    }));
  };

  /**
   * 엔터키로 값 추가
   * --
   * @param {KeyboardEvent<HTMLInputElement>} e
   */
  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleAddValues();
    }
  };

  /**
   * 옵션 렌더링
   * --
   * @param {ColumnOptions} options
   * @returns
   */
  const optionsRendering = (options: ColumnOptions) => {
    if (!options || !options.type) return null;

    switch (options.type) {
      case 'pk': {
        const pkOption = options as PrimaryOptions;

        return (
          <div className={'grid grid-cols-1 gap-2'}>
            <Select
              disabled={props.disabled}
              value={pkOption.valueType}
              onValueChange={(value) =>
                handleSelectedChange('valueType', value)
              }
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder={ContentMessages.TYPE[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'uuid'}>uuid</SelectItem>
                  <SelectItem value={'number'}>number</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {pkOption.valueType === 'number' ? (
              <Input
                type={'number'}
                value={pkOption.min}
                onChange={(e) =>
                  handleSelectedChange('min', inputIntegerValue(e.target.value))
                }
                placeholder={
                  ContentMessages.INPUT_MINIMUM_OPTION_VALUE_PLACEHOLDER[
                    language
                  ]
                }
                disabled={props.disabled}
              />
            ) : null}
          </div>
        );
      }
      case 'date': {
        const dateOption = options as DateOptions;
        return (
          <div className={'grid grid-cols-2 gap-2'}>
            <div
              className={`${dateOption.valueType === 'date' ? 'col-span-1' : 'col-span-2'}`}
            >
              <Select
                disabled={props.disabled}
                value={dateOption.valueType}
                onValueChange={(value) =>
                  handleSelectedChange('valueType', value)
                }
              >
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder={ContentMessages.TYPE[language]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'date'}>Date</SelectItem>
                    <SelectItem value={'unix'}>Unix Time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {dateOption.valueType === 'date' ? (
              <Input
                className={'w-full'}
                value={dateOption.format}
                placeholder={ContentMessages.FORMAT_DATE[language]}
                onChange={(e) => handleSelectedChange('format', e.target.value)}
                disabled={props.disabled}
              />
            ) : null}

            <DatePicker
              placeholder={
                ContentMessages.PICK_MINIMUM_DATE_PLACEHOLDER[language]
              }
              onChange={(date) => handleSelectedChange('startDate', date)}
              disabled={props.disabled}
            />
            <DatePicker
              placeholder={
                ContentMessages.PICK_MAXIMUM_DATE_PLACEHOLDER[language]
              }
              onChange={(date) => handleSelectedChange('endDate', date)}
              disabled={props.disabled}
            />
          </div>
        );
      }
      case 'number': {
        const numberOption = options as NumberOptions;

        return (
          <div className={'grid grid-cols-2 gap-2'}>
            <Input
              type={'number'}
              value={numberOption.min}
              onChange={(e) =>
                handleSelectedChange('min', inputIntegerValue(e.target.value))
              }
              placeholder={
                ContentMessages.INPUT_MINIMUM_OPTION_VALUE_PLACEHOLDER[language]
              }
              disabled={props.disabled}
            />
            <Input
              type={'number'}
              value={numberOption.max}
              onChange={(e) =>
                handleSelectedChange('max', inputIntegerValue(e.target.value))
              }
              placeholder={
                ContentMessages.INPUT_MAXIMUM_OPTION_VALUE_PLACEHOLDER[language]
              }
              disabled={props.disabled}
            />
            <Input
              type={'number'}
              value={numberOption.precision}
              onChange={(e) =>
                handleSelectedChange(
                  'precision',
                  inputIntegerValue(e.target.value),
                )
              }
              placeholder={
                ContentMessages.INPUT_PRECISION_OPTION_VALUE_PLACEHOLDER[
                  language
                ]
              }
              disabled={props.disabled}
              className={'col-span-2'}
            />
          </div>
        );
      }
      case 'enum': {
        const enumOption = options as EnumOptions;

        return (
          <div className={'grid grid-cols-1 gap-2'}>
            <div className={'flex gap-2 items-center'}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={ContentMessages.INPUT_VALUE_PLACEHOLDER[language]}
                onKeyDown={handlePressEnter}
              />
              <Button size={'icon'} onClick={handleAddValues}>
                <PlusSquare />
              </Button>
            </div>
            {enumOption.values.length ? (
              <div
                className={
                  'flex gap-2 flex-wrap border rounded-sm p-2 bg-muted'
                }
              >
                {enumOption.values.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className={'flex items-center gap-2'}
                  >
                    <span className={'text-sm'}>{value}</span>{' '}
                    <Button
                      size={'icon-sm'}
                      variant={'outline'}
                      onClick={() => handleRemoveValues(value)}
                      className={'cursor-pointer'}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      }
      case 'boolean': {
        const booleanOption = options as BooleanOptions;

        return (
          <div className={'flex justify-between items-center gap-4'}>
            <Select
              disabled={props.disabled}
              value={booleanOption.valueType}
              onValueChange={(value) =>
                handleSelectedChange('valueType', value)
              }
            >
              <SelectTrigger className={'flex-1'}>
                <SelectValue placeholder={'type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'boolean'}>
                    Boolean (true/false)
                  </SelectItem>
                  <SelectItem value={'number'}>Number (0/1)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }
      case 'name': {
        const nameOption = options as NameOptions;

        return (
          <div className={'grid grid-cols-2 gap-2'}>
            <Select
              disabled={props.disabled}
              value={nameOption.valueType}
              onValueChange={(value) =>
                handleSelectedChange('valueType', value)
              }
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder={ContentMessages.TYPE[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(NAME_COLUMN_OPTION_VALUE_TYPES).map((item) => (
                    <SelectItem
                      key={`${item.title}-${item.value}`}
                      value={item.value}
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              disabled={props.disabled}
              value={nameOption.language}
              onValueChange={(value) => handleSelectedChange('language', value)}
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue
                  placeholder={ContentMessages.LANGUAGES_PLACEHOLDER[language]}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(LANGUAGES).map((lang) => (
                    <SelectItem
                      key={`${lang.title}-${lang.value}`}
                      value={lang.value}
                    >
                      {lang.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }
      case 'email': {
        // const emailOption = options as EmailOptions;

        return <div></div>;
      }
      case 'address': {
        const addressOption = options as AddressOptions;

        return (
          <div className={'grid grid-cols-2 gap-2'}>
            <Select
              disabled={props.disabled}
              value={addressOption.valueType}
              onValueChange={(value) =>
                handleSelectedChange('valueType', value)
              }
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder={ContentMessages.TYPE[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(ADDRESS_COLUMN_OPTION_VALUE_TYPES).map(
                    (item) => (
                      <SelectItem
                        key={`${item.title}-${item.value}`}
                        value={item.value}
                      >
                        {item.title}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              disabled={props.disabled}
              value={addressOption.language}
              onValueChange={(value) => handleSelectedChange('language', value)}
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue
                  placeholder={ContentMessages.LANGUAGES_PLACEHOLDER[language]}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* {Object.values(LANGUAGES).map((lang) => (
                    <SelectItem
                      key={`${lang.title}-${lang.value}`}
                      value={lang.value}
                    >
                      {lang.title}
                    </SelectItem>
                  ))} */}
                  <SelectItem key={`korean-${'ko'}`} value={'ko'}>
                    Korean
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      }
      case 'contact': {
        const contactOption = options as ContactOptions;

        return (
          <div className={'grid grid-cols-2 gap-2'}>
            <Select
              disabled={props.disabled}
              value={contactOption.valueType}
              onValueChange={(value) =>
                handleSelectedChange('valueType', value)
              }
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder={ContentMessages.TYPE[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(CONTACT_COLUMN_OPTION_VALUE_TYPES).map(
                    (item) => (
                      <SelectItem
                        key={`${item.title}-${item.value}`}
                        value={item.value}
                      >
                        {item.title}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              disabled={props.disabled}
              value={contactOption.format || ''}
              onChange={(e) => handleSelectedChange('format', e.target.value)}
              placeholder={ContentMessages.CONTACT_FORMAT_PLACEHOLDER[language]}
              maxLength={1}
            />
          </div>
        );
      }
      default:
        return <></>;
    }
  };

  const isEmptyOptions = ['email'];
  if (isEmptyOptions.includes(selected.type)) return null;

  return (
    <div className={'flex flex-col gap-2'}>
      <Label>{ContentMessages.OPTIONS_LABEL[language]}</Label>
      {optionsRendering(selected)}
    </div>
  );
}
