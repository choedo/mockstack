export function inputIntegerValue(value: string) {
  return value.replace(/[^0-9]/g, '');
}

export function pressEnter(
  event: React.KeyboardEvent<HTMLInputElement>,
  callback: () => void,
) {
  if (event.code === 'Enter') {
    callback();
  }
}
