import {
  mockGenerateValue,
  type MockGenerateValueResult,
} from '@/lib/mock-generator';
import type { ColumnEntity, DBDialect } from '@/types/data';

const getIdentifier = (name: string, dbType: DBDialect) => {
  switch (dbType) {
    case 'MYSQL':
      return `\`${name}\``; // MySQL은 백틱
    case 'MSSQL':
      return `[${name}]`; // MS SQL은 대괄호
    case 'POSTGRESQL':
    default:
      return `"${name}"`; // PostgreSQL 등 ANSI 표준은 겹따옴표
  }
};

type SchemaGenerator = (
  tableName: string,
  columns: ColumnEntity[],
  amount: number,
  dbType?: DBDialect,
) => string;
const schemaSQLGenerator: SchemaGenerator = (
  tableName,
  columns,
  amount,
  dbType = 'MYSQL',
) => {
  const colNames = columns
    .map((column) => getIdentifier(column.column_name, dbType))
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

  const safeTableName = getIdentifier(tableName, dbType);

  return `INSERT INTO ${safeTableName} (${colNames})\nVALUES\n ${rows.join(',\n  ')};`;
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
