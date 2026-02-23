import {
  mockGenerateValue,
  type MockGenerateValueResult,
} from '@/lib/mock-generator';
import type { ColumnEntity } from '@/types/data';

type SchemaGenerator = (
  tableName: string,
  columns: ColumnEntity[],
  amount: number,
) => string;
const schemaSQLGenerator: SchemaGenerator = (tableName, columns, amount) => {
  const colNames = columns
    .map((column) => `\`${column.column_name}\``)
    .join(', ');
  const rows: string[] = [];

  for (let i = 0; i < amount; i++) {
    const values = columns.map((column) => {
      const val = mockGenerateValue(column, i);

      if (typeof val === 'number') return val;
      else if (typeof val === 'boolean') return val;
      else return `'${String(val)}'`;
    });
    rows.push(`(${values.join(', ')})`);
  }

  return `INSERT INTO \`${tableName}\` (${colNames})\nVALUES\n ${rows.join(',\n  ')};`;
};

const schemaJSONGenerator: SchemaGenerator = (tableName, columns, amount) => {
  const data = [];

  for (let i = 0; i < amount; i++) {
    const row: Record<string, MockGenerateValueResult> = {};
    columns.forEach(
      (column) => (row[column.column_name] = mockGenerateValue(column, i)),
    );
    data.push(row);
  }

  const schema = {
    table: tableName,
    createdAt: new Date().toISOString(),
    data,
  };

  return JSON.stringify(schema, null, 2);
};

export const SchemaGenerator = {
  toSQL: schemaSQLGenerator,
  toJSON: schemaJSONGenerator,
};
