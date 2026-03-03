type IntegerMaxValue = { type: 'max'; max: number };
type IntegerMinValue = { type: 'min'; min: number };
type IntegerBetweenValue = { type: 'between'; min: number; max: number };
export type IntegerValueOptions =
  | IntegerMaxValue
  | IntegerMinValue
  | IntegerBetweenValue;
export function inputIntegerValue(
  value: string,
  options?: IntegerValueOptions,
) {
  const replaceValue = value.replace(/[^0-9]/g, '');

  if (replaceValue.trim() === '') return replaceValue;

  if (options) {
    if (options.type === 'max')
      return Math.min(Number(replaceValue), options.max);
    else if (options.type === 'min')
      return Math.max(Number(replaceValue), options.min);
    else if (options.type === 'between')
      return Math.max(Math.min(Number(replaceValue), options.max), options.min);
  } else return replaceValue;
}

export function pressEnter(
  event: React.KeyboardEvent<HTMLInputElement>,
  callback: () => void,
) {
  if (event.code === 'Enter') {
    callback();
  }
}
