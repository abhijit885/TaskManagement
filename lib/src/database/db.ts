import SQLite from 'react-native-sqlite-storage';

let db: any;

SQLite.openDatabase({ name: 'tasks.db', location: 'default' }).then((database) => {
  db = database;
});

export const createTables = () => {
  db.transaction((tx:any) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, completed INTEGER, createdAt TEXT);'
    );
  });
};

export const insertTask = (task: any) => {
  db.transaction((tx:any) => {
    tx.executeSql(
      'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, ?, ?);',
      [task.title, task.description, task.completed, task.createdAt]
    );
  });
};
