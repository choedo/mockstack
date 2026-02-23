export const MOCK_DB_DIALECT = ['MYSQL', 'POSTGRESQL', 'MSSQL'] as const;
export const MOCK_DATA_ITEMS = ['JSON', ...MOCK_DB_DIALECT] as const;
