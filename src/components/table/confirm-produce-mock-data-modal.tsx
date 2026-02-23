import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { inputIntegerValue } from '@/lib/input-value';
import { Spinner } from '@/components/ui/spinner';
import toastMessage from '@/lib/toast-message';
import type { ColumnEntity, DBDialect } from '@/types/data';
import { SchemaGenerator } from '@/lib/generator';

import { useOpenMockResultModal } from '@/store/mock-result-modal';
import { useLanguage } from '@/store/translation';
import { AlertMessages } from '@/languages/alert-messages';
import { ContentMessages } from '@/languages/content-messages';
import { MOCK_DB_DIALECT } from '@/data/mock';

type Props = {
  columns: ColumnEntity[];
  tableName: string;
};

export default function ConfirmProduceMockDataModal(props: Props) {
  const language = useLanguage();
  const openResultModal = useOpenMockResultModal();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const handleOpenChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setOpen(true);
  };

  const handleProduceClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (amount.trim() === '') {
      toastMessage.info(
        AlertMessages.REQUIRED_INPUT_MOCK_DATA_AMOUNT[language],
      );
      return;
    }

    setLoading(true);

    const result = {
      JSON: SchemaGenerator.toJSON(
        props.tableName,
        props.columns,
        Number(amount),
      ),
      ...MOCK_DB_DIALECT.reduce(
        (acc, cur) => {
          acc[cur] = SchemaGenerator.toSQL(
            props.tableName,
            props.columns,
            Number(amount),
            cur,
          );

          return acc;
        },
        {} as Record<DBDialect, string>,
      ),
    };

    setTimeout(() => {
      openResultModal(result);
      setOpen(false);
      setAmount('');
      setLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    return () => {
      setAmount('');
      setLoading(false);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          className={'cursor-pointer'}
          onClick={(e) => handleOpenChange(e)}
        >
          {ContentMessages.PRODUCE_BUTTON[language]}
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {ContentMessages.PRODUCE_MOCK_DATA_TITLE[language]}
          </DialogTitle>
          <DialogDescription>
            {ContentMessages.PRODUCE_MOCK_DATA_DESCRIPTION[language]}
          </DialogDescription>
        </DialogHeader>
        <div className={'flex items-center gap-2'}>
          <Input
            ref={inputRef}
            type={'number'}
            value={amount}
            onChange={(e) => setAmount(inputIntegerValue(e.target.value))}
            placeholder={
              ContentMessages.INPUT_MOCK_DATA_AMOUNT_PLACEHOLDER[language]
            }
            disabled={loading}
            maxLength={3}
          />
        </div>
        <div className={'flex gap-2 items-center justify-end'}>
          <Button
            variant={'outline'}
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            {ContentMessages.CANCEL_BUTTON[language]}
          </Button>
          <Button disabled={loading} onClick={(e) => handleProduceClick(e)}>
            {loading ? <Spinner /> : null}{' '}
            {ContentMessages.PRODUCE_BUTTON[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
