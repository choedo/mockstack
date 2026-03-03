import React from 'react';
import { useMockResultModal } from '@/store/mock-result-modal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_DATA_ITEMS } from '@/data/mock';
import type { MockDataType } from '@/types/data';
import toastMessage from '@/lib/toast-message';
import Pre from '@/components/ui/pre';

export default function MockResultModal() {
  const store = useMockResultModal();

  const [dataType, setDataType] = React.useState<MockDataType>('JSON');
  const [isCopied, setIsCopied] = React.useState(false);

  if (!store.isOpen) return;

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(store.mocks[dataType]);

    toastMessage.success('Copied');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000);
  };

  return (
    <Dialog open={store.isOpen} onOpenChange={store.actions.close}>
      <DialogContent className={'min-w-3xl'}>
        <DialogTitle>
          <Select
            value={dataType}
            onValueChange={(value: MockDataType) => setDataType(value)}
          >
            <SelectTrigger className={'w-50'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MOCK_DATA_ITEMS.map((item, index) => (
                  <SelectItem
                    key={`mock-data-item-${item}-${index}`}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </DialogTitle>
        <ScrollArea
          className={'rounded-md border h-[50dvh] w-full bg-muted relative p-4'}
        >
          <Button
            size={'icon'}
            variant={'outline'}
            className={'absolute top-2 right-2 cursor-pointer'}
            onClick={handleCopyClick}
          >
            {isCopied ? (
              <CheckIcon color={'green'} strokeWidth={3} />
            ) : (
              <CopyIcon />
            )}
          </Button>

          <Pre>
            <code>{store.mocks[dataType]}</code>
          </Pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
