import { describe, it, expect } from 'vitest';
import { RandomUtils } from '@/lib/random-utils';
import dayjs from 'dayjs';

describe('RandomUtils', () => {
  it('getInt: min과 max 사이의 정수를 반환해야 한다', () => {
    const min = 10;
    const max = 20;
    const result = RandomUtils.getInt(min, max);

    expect(result).toBeGreaterThanOrEqual(min); // result >= min
    expect(result).toBeLessThanOrEqual(max); // result <= max
    expect(Number.isInteger(result)).toBe(true);
  });

  it('getRandomEmail: @ 기호와 지정된 도메인을 포함해야 한다', () => {
    const email = RandomUtils.getRandomEmail();

    expect(email).toContain('@');
    // 이메일 형식이 맞는지 정규식 검사
    expect(email).toMatch(/^[a-z0-9]+@[a-z0-9.-]+\.[a-z]{2,}$/i);
  });

  it('getRandomContact: 지정된 format(구분자)으로 연결되어야 한다', () => {
    const contact = RandomUtils.getRandomContact('mobile', '-');

    // 예: 010-1234-5678 형식이므로 '-'가 2개 있어야 함
    expect(contact.split('-')).toHaveLength(3);
    // 정규식으로 숫자-숫자-숫자 포맷 확인
    expect(contact).toMatch(/^\d{2,3}-\d{3,4}-\d{4}$/);
  });

  it('getDate: valueType에 따라 올바른 타입(string | number)을 반환해야 한다', () => {
    const minDate = new Date('2000-01-01');
    const maxDate = new Date('2000-01-31');
    const format = 'YYYY-MM-DD';
    const dateStr = RandomUtils.getDate({
      type: 'date',
      valueType: 'date',
      format: format,
      startDate: minDate,
      endDate: maxDate,
    });
    const dateUnix = RandomUtils.getDate({
      type: 'date',
      valueType: 'unix',
      startDate: minDate,
      endDate: maxDate,
    });

    expect(typeof dateStr).toBe('string');
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dayjs(dateStr).isAfter(minDate)).toBe(true);
    expect(dayjs(dateStr).isBefore(maxDate)).toBe(true);

    expect(typeof dateUnix).toBe('number');
    expect(dayjs.unix(dateUnix as number).isAfter(minDate)).toBe(true);
    expect(dayjs.unix(dateUnix as number).isBefore(maxDate)).toBe(true);
  });

  it('getRandomString: 지정된 길이의 문자열을 반환해야 한다', () => {
    const min = 5;
    const max = 10;
    const result = RandomUtils.getRandomString(min, max);

    expect(result.length).toBeGreaterThanOrEqual(min);
    expect(result.length).toBeLessThanOrEqual(max);
  });
});
