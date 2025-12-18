import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'firebase_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'age', type: 'number' },
        { name: 'is_checked', type: 'boolean' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'sync_status', type: 'string' }, // 'synced' | 'created' | 'updated' | 'deleted'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'firebase_id', type: 'string', isIndexed: true },
        { name: 'email', type: 'string' },
        { name: 'display_name', type: 'string', isOptional: true },
        { name: 'is_synced', type: 'boolean' },
        { name: 'sync_status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});

