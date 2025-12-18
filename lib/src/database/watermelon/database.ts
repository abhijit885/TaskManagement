import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import { models } from './models';

// First, create the adapter to the underlying database
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out during development)
  // migrations,
  dbName: 'taskManagementDB',
  // (optional database location: default location for iOS (Documents), 
  // or using shared app group, or for Android - default to 'databases')
  jsi: Platform.OS === 'ios', // JSI is faster for iOS
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load - log error
    console.error('Database setup error:', error);
  },
});

// Then, create the database
const database = new Database({
  adapter,
  modelClasses: models,
});

export default database;

