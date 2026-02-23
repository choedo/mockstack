import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useColumnEditorModal } from '@/store/column-editor-modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CUSTOM_COLUMN_TYPES, DEFAULT_COLUMN_TYPES } from '@/constants/column';
import ColumnOptionSelector from '@/components/column/column-option-selector';
import type { ColumnOptions, ColumnTypes } from '@/types/data';
import { useCreateColumn } from '@/hooks/column/use-create-column';
import { useUpdateColumn } from '@/hooks/column/use-update-column';
import toastMessage from '@/lib/toast-message';
import { Button } from '@/components/ui/button';
import { columnValidateCheck } from '@/lib/column-validate-check';
import {
  duplicateCheckColumnName,
  duplicateCheckPrimaryColumn,
} from '@/api/column';
import { useDeleteColumn } from '@/hooks/column/use-delete-column';
import { useOpenAlertModal } from '@/store/alert-modal';
import { useLanguage } from '@/store/translation';
import { AlertMessages } from '@/languages/alert-messages';
import { ContentMessages } from '@/languages/content-messages';

export default function ColumnEditorModal() {
  const language = useLanguage();
  const columnEditModal = useColumnEditorModal();
  const openAlert = useOpenAlertModal();

  const { mutate: createColumn, isPending: isCreateColumnPending } =
    useCreateColumn({
      onSuccess: () => {
        toastMessage.success(AlertMessages.SUCCESS_COLUMN_CREATED[language]);

        columnEditModal.actions.close();
      },
      onError: (error) => {
        console.error(error);
        const message = AlertMessages.FAIL_COLUMN_CREATED[language];
        toastMessage.error(message);
      },
    });
  const { mutate: updateColumn, isPending: isUpdateColumnPending } =
    useUpdateColumn({
      onSuccess: () => {
        toastMessage.success(AlertMessages.SUCCESS_COLUMN_UPDATED[language]);

        columnEditModal.actions.close();
      },
      onError: (error) => {
        console.error(error);
        const message = AlertMessages.FAIL_COLUMN_UPDATED[language];
        toastMessage.error(message);
      },
    });
  const { mutate: deleteColumn, isPending: isDeleteColumnPending } =
    useDeleteColumn({
      onSuccess: () => {
        toastMessage.success(AlertMessages.SUCCESS_COLUMN_DELETED[language]);

        columnEditModal.actions.close();
      },
      onError: (error) => {
        console.error(error);
        const message = AlertMessages.FAIL_COLUMN_DELETED[language];
        toastMessage.error(message);
      },
    });

  const titleRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<ColumnTypes | ''>('');
  const [options, setOptions] = React.useState<ColumnOptions>({
    type: 'pk',
    valueType: 'uuid',
  });

  const handleSubmitClick = async () => {
    if (!columnEditModal.isOpen) return;

    if (title.trim() === '') {
      toastMessage.info(AlertMessages.REQUIRED_COLUMN_NAME_INPUT[language]);
      return;
    }

    if (type === '') {
      toastMessage.info(AlertMessages.REQUIRED_COLUMN_TYPE_INPUT[language]);
      return;
    }

    // Primary key 중복 체크
    if (columnEditModal.mode === 'CREATE' && type === 'pk') {
      const duplicatePrimaryKeyCheck = await duplicateCheckPrimaryColumn(
        columnEditModal.tableId,
      );

      if (!duplicatePrimaryKeyCheck) {
        toastMessage.info(AlertMessages.UNIQUE_PRIMARY_KEY_COLUMN[language]);
        return;
      }
    }

    // 컬럼명 중복 체크
    // CREATE 모드인 경우 무조건 체크, EDIT 모드인 경우 컬럼명이 변경된 경우에만 체크
    if (
      columnEditModal.mode === 'CREATE' ||
      (columnEditModal.mode === 'EDIT' && title !== columnEditModal.title)
    ) {
      const duplicateNameCheck = await duplicateCheckColumnName({
        tableId: columnEditModal.tableId,
        title: title,
      });

      if (!duplicateNameCheck) {
        toastMessage.info(AlertMessages.UNIQUE_COLUMN_NAME[language]);
        return;
      }
    }

    const validateCheck = columnValidateCheck(options);
    if (validateCheck.status === 'Fail') {
      toastMessage.info(validateCheck.message[language]);
      return;
    } else {
      if (columnEditModal.mode === 'CREATE') {
        createColumn({
          column_name: title,
          column_type: type,
          column_values: validateCheck.data,
          table_id: columnEditModal.tableId,
        });
      } else {
        updateColumn({
          column_id: columnEditModal.columnId,
          column_name: title,
          column_type: type,
          column_values: validateCheck.data,
        });
      }
    }
  };

  const handleDeleteClick = () => {
    if (!columnEditModal.isOpen || columnEditModal.mode === 'CREATE') return;

    openAlert({
      title: AlertMessages.WARNING_TITLE[language],
      description: AlertMessages.CONFIRM_DELETE_DESCRIPTION[language],
      onPositive: () => deleteColumn(columnEditModal.columnId),
    });
  };

  React.useEffect(() => {
    if (columnEditModal.isOpen) {
      const mode = columnEditModal.mode;

      if (mode === 'EDIT') {
        setTitle(columnEditModal.title);
        setType(columnEditModal.type);
        setOptions(columnEditModal.options);
      }
    }

    return () => {
      setTitle('');
      setType('');
      setOptions({
        type: 'pk',
        valueType: 'uuid',
      });
    };
  }, [columnEditModal]);

  if (!columnEditModal.isOpen) return;

  const isPending =
    isCreateColumnPending || isUpdateColumnPending || isDeleteColumnPending;

  return (
    <Dialog
      open={columnEditModal.isOpen}
      onOpenChange={columnEditModal.actions.close}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {columnEditModal.mode === 'CREATE'
              ? ContentMessages.CREATE_COLUMN_TITLE[language]
              : ContentMessages.EDIT_COLUMN_TITLE[language]}
          </DialogTitle>
        </DialogHeader>
        <div className={'flex flex-col gap-4'}>
          <div className={'flex flex-col gap-2'}>
            <Label htmlFor={'title'}>
              {ContentMessages.COLUMN_NAME_LABEL[language]}
            </Label>
            <Input
              ref={titleRef}
              id={'title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                columnEditModal.mode === 'CREATE'
                  ? ContentMessages.COLUMN_NAME_PLACEHOLDER[language]
                  : columnEditModal.title
              }
              disabled={isPending}
            />
          </div>
          <div className={'flex flex-col gap-2'}>
            <Label htmlFor={'description'}>
              {ContentMessages.COLUMN_TYPE_LABEL[language]}
            </Label>
            <Select
              disabled={isPending}
              value={type}
              onValueChange={(value: ColumnTypes) => setType(value)}
            >
              <SelectTrigger className={'w-full'}>
                <SelectValue
                  placeholder={
                    ContentMessages.COLUMN_TYPE_PLACEHOLDER[language]
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {ContentMessages.COLUMN_DEFAULT_VALUE_LABEL[language]}
                  </SelectLabel>
                  {Object.values(DEFAULT_COLUMN_TYPES).map((item, index) => (
                    <SelectItem
                      key={`select-item-${item.value}-${index}`}
                      value={item.value}
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>
                    {ContentMessages.COLUMN_CUSTOM_VALUE_LABEL[language]}
                  </SelectLabel>
                  {Object.values(CUSTOM_COLUMN_TYPES).map((item, index) => (
                    <SelectItem
                      key={`select-item-${item.value}-${index}`}
                      value={item.value}
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {type !== '' ? (
            <ColumnOptionSelector
              type={type}
              onChange={(selected) => setOptions(selected)}
              disabled={isPending}
              defaultValue={options}
            />
          ) : null}
        </div>
        <div className={'flex justify-center items-center gap-2'}>
          {columnEditModal.mode === 'EDIT' ? (
            <Button
              variant={'destructive'}
              disabled={isPending}
              className={'cursor-pointer'}
              onClick={handleDeleteClick}
            >
              {ContentMessages.DELETE_BUTTON[language]}
            </Button>
          ) : null}
          <Button
            disabled={isPending}
            className={'cursor-pointer'}
            onClick={handleSubmitClick}
          >
            {ContentMessages.SUBMIT_BUTTON[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
