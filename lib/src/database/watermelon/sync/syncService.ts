import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import database from '../database';
import Todo from '../models/Todo';
import { Q } from '@nozbe/watermelondb';

// Types
export interface TodoData {
  id: string;
  name: string;
  age: number;
  isChecked: boolean;
}

// Callback type for sync events
type SyncCallback = () => void;
type NetworkStatusCallback = (isOnline: boolean) => void;

class SyncService {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private unsubscribeNetInfo: (() => void) | null = null;
  
  // Callbacks for external listeners
  private onSyncCompleteCallbacks: SyncCallback[] = [];
  private onNetworkChangeCallbacks: NetworkStatusCallback[] = [];

  // Register callback for when sync completes
  onSyncComplete(callback: SyncCallback): () => void {
    this.onSyncCompleteCallbacks.push(callback);
    return () => {
      this.onSyncCompleteCallbacks = this.onSyncCompleteCallbacks.filter(cb => cb !== callback);
    };
  }

  // Register callback for network status changes
  onNetworkChange(callback: NetworkStatusCallback): () => void {
    this.onNetworkChangeCallbacks.push(callback);
    return () => {
      this.onNetworkChangeCallbacks = this.onNetworkChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all sync complete listeners
  private notifySyncComplete() {
    this.onSyncCompleteCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in sync complete callback:', error);
      }
    });
  }

  // Notify all network change listeners
  private notifyNetworkChange(isOnline: boolean) {
    this.onNetworkChangeCallbacks.forEach(callback => {
      try {
        callback(isOnline);
      } catch (error) {
        console.error('Error in network change callback:', error);
      }
    });
  }

  // Get current online status
  getIsOnline(): boolean {
    return this.isOnline;
  }

  // Initialize network listener
  init() {
    // Get initial network state
    NetInfo.fetch().then(state => {
      this.isOnline = state.isConnected === true && state.isInternetReachable !== false;
      console.log('Initial network status:', this.isOnline ? 'Online' : 'Offline');
    });

    // Subscribe to network changes
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      const nowOnline = state.isConnected === true && state.isInternetReachable !== false;
      
      // Only process if status actually changed
      if (this.isOnline !== nowOnline) {
        this.isOnline = nowOnline;

        // Notify listeners about network change
        this.notifyNetworkChange(this.isOnline);

        // If we just came back online, trigger full sync
        if (wasOffline && this.isOnline) {
          console.log('Network restored - triggering auto sync...');
          this.autoSyncOnReconnect();
        }
      }
    });
  }

  // Auto sync when network is restored
  private async autoSyncOnReconnect(): Promise<void> {
    try {
      // First push all local pending changes
      await this.syncToFirebase();
      
      // Then pull any new data from Firebase
      await this.pullFromFirebase();
      
      console.log('Auto sync completed successfully');
      
      // Notify listeners that sync is complete
      this.notifySyncComplete();
    } catch (error) {
      console.error('Auto sync failed:', error);
    }
  }

  // Cleanup listener
  cleanup() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
    this.onSyncCompleteCallbacks = [];
    this.onNetworkChangeCallbacks = [];
  }

  // Check if device is online
  async checkConnection(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      this.isOnline = state.isConnected === true && state.isInternetReachable !== false;
      return this.isOnline;
    } catch (error) {
      console.log('Error checking connection:', error);
      return false;
    }
  }
  // TODO CRUD OPERATIONS
  // Add Todo - ALWAYS saves locally first, then syncs if online
  async addTodo(data: { name: string; age: number; isChecked?: boolean }): Promise<Todo> {
    const todosCollection = database.get<Todo>('todos');

    //ALWAYS save to local DB first (instant)
    const newTodo = await database.write(async () => {
      return await todosCollection.create(todo => {
        todo.firebaseId = '';
        todo.name = data.name;
        todo.age = data.age;
        todo.isChecked = data.isChecked || false;
        todo.isSynced = false;
        todo.localSyncStatus = 'created';
      });
    });

    console.log('Todo saved locally with ID:', newTodo.id);

    //Try to sync if online (non-blocking)
    this.trySyncNewTodo(newTodo.id);

    // Return the local todo immediately
    return newTodo;
  }

  // Try to sync a new todo in background
  private async trySyncNewTodo(todoId: string): Promise<void> {
    try {
      const isOnline = await this.checkConnection();
      if (!isOnline) {
        console.log('Offline - will sync later');
        return;
      }
      const todosCollection = database.get<Todo>('todos');
      const todo = await todosCollection.find(todoId);
      const docRef = await firestore()
        .collection('Todo')
        .add({
          name: todo.name,
          age: todo.age,
          isChecked: todo.isChecked,
        });

      await database.write(async () => {
        await todo.update(record => {
          record.firebaseId = docRef.id;
          record.isSynced = true;
          record.localSyncStatus = 'synced';
        });
      });

      console.log('Todo synced to Firebase:', docRef.id);
      // Notify listeners to refresh UI
      this.notifySyncComplete();
    } catch (error) {
      console.log('Sync failed, will retry later:', error);
    }
  }
  // Update Todo - ALWAYS updates locally first, then syncs if online
  async updateTodo(localId: string, data: Partial<{ name: string; age: number; isChecked: boolean }>): Promise<Todo> {
    const todosCollection = database.get<Todo>('todos');
    const todo = await todosCollection.find(localId);
    const currentSyncStatus = todo.localSyncStatus;

    //ALWAYS update local DB first (instant)
    await database.write(async () => {
      await todo.update(record => {
        if (data.name !== undefined) record.name = data.name;
        if (data.age !== undefined) record.age = data.age;
        if (data.isChecked !== undefined) record.isChecked = data.isChecked;
        record.isSynced = false;
        record.localSyncStatus = currentSyncStatus === 'created' ? 'created' : 'updated';
      });
    });
    console.log('📝 Todo updated locally:', localId);
    // Get updated todo
    const updatedTodo = await todosCollection.find(localId);
    // Try to sync if online (non-blocking)
    this.trySyncUpdatedTodo(localId, data);
    // Return the local todo immediately
    return updatedTodo;
  }

  // Try to sync an updated todo in background
  private async trySyncUpdatedTodo(todoId: string, data: Partial<{ name: string; age: number; isChecked: boolean }>): Promise<void> {
    try {
      const isOnline = await this.checkConnection();
      if (!isOnline) {
        console.log('📴 Offline - will sync later');
        return;
      }

      const todosCollection = database.get<Todo>('todos');
      const todo = await todosCollection.find(todoId);

      // If it was created offline and never synced, create it first
      if (!todo.firebaseId) {
        await this.trySyncNewTodo(todoId);
        return;
      }

      await firestore()
        .collection('Todo')
        .doc(todo.firebaseId)
        .update({
          name: data.name ?? todo.name,
          age: data.age ?? todo.age,
          isChecked: data.isChecked ?? todo.isChecked,
        });

      await database.write(async () => {
        await todo.update(record => {
          record.isSynced = true;
          record.localSyncStatus = 'synced';
        });
      });

      console.log('Todo update synced to Firebase');
      // Notify listeners to refresh UI
      this.notifySyncComplete();
    } catch (error) {
      console.log('Update sync failed, will retry later:', error);
    }
  }

  // Delete Todo - ALWAYS handles locally first, then syncs if online
  async deleteTodo(localId: string): Promise<void> {
    const todosCollection = database.get<Todo>('todos');
    const todo = await todosCollection.find(localId);
    const firebaseId = todo.firebaseId;

    // If never synced to Firebase (created offline), just delete locally
    if (!firebaseId || todo.localSyncStatus === 'created') {
      await database.write(async () => {
        await todo.destroyPermanently();
      });
      console.log('Offline-created todo deleted locally');
      return;
    }

    // Mark as deleted locally (will be removed from list view)
    await database.write(async () => {
      await todo.update(record => {
        record.isSynced = false;
        record.localSyncStatus = 'deleted';
      });
    });

    console.log('Todo marked for deletion:', localId);

    // Try to sync delete if online (non-blocking)
    this.trySyncDeletedTodo(localId, firebaseId);
  }

  // Try to sync a deleted todo in background
  private async trySyncDeletedTodo(todoId: string, firebaseId: string): Promise<void> {
    try {
      const isOnline = await this.checkConnection();
      if (!isOnline) {
        console.log('Offline - will sync delete later');
        return;
      }

      await firestore()
        .collection('Todo')
        .doc(firebaseId)
        .delete();

      // Now permanently delete locally
      const todosCollection = database.get<Todo>('todos');
      try {
        const todo = await todosCollection.find(todoId);
        await database.write(async () => {
          await todo.destroyPermanently();
        });
      } catch (e) {
        // Already deleted
      }

      console.log('Todo deleted from Firebase');
    } catch (error) {
      console.log('Delete sync failed, will retry later:', error);
    }
  }

  // Get all Todos from local DB (excludes deleted items)
  async getTodos(): Promise<Todo[]> {
    const todosCollection = database.get<Todo>('todos');
    return await todosCollection.query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).fetch();
  }

  // Get Todos as observable for real-time updates
  observeTodos() {
    const todosCollection = database.get<Todo>('todos');
    return todosCollection.query(
      Q.where('sync_status', Q.notEq('deleted'))
    ).observe();
  }
  // SYNC OPERATIONS
  // Sync all pending changes to Firebase
  async syncToFirebase(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return;
    }

    const isOnline = await this.checkConnection();
    if (!isOnline) {
      console.log('Cannot sync - device is offline');
      return;
    }

    this.syncInProgress = true;
    console.log('Starting sync to Firebase...');

    try {
      const todosCollection = database.get<Todo>('todos');

      // Get all unsynced todos
      const unsyncedTodos = await todosCollection.query(
        Q.where('is_synced', false)
      ).fetch();

      console.log(`Found ${unsyncedTodos.length} unsynced todos`);

      for (const todo of unsyncedTodos) {
        try {
          switch (todo.localSyncStatus) {
            case 'created':
              await this.syncCreatedTodo(todo);
              break;
            case 'updated':
              await this.syncUpdatedTodo(todo);
              break;
            case 'deleted':
              await this.syncDeletedTodo(todo);
              break;
          }
        } catch (error) {
          console.error(`Failed to sync todo ${todo.id}:`, error);
        }
      }

      console.log('Sync completed');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncCreatedTodo(todo: Todo): Promise<void> {
    const docRef = await firestore()
      .collection('Todo')
      .add(todo.toFirebaseObject());

    await database.write(async () => {
      await todo.update(record => {
        record.firebaseId = docRef.id;
        record.isSynced = true;
        record.localSyncStatus = 'synced';
      });
    });

    console.log(`Created todo synced with ID: ${docRef.id}`);
  }

  private async syncUpdatedTodo(todo: Todo): Promise<void> {
    if (!todo.firebaseId) {
      await this.syncCreatedTodo(todo);
      return;
    }

    await firestore()
      .collection('Todo')
      .doc(todo.firebaseId)
      .update(todo.toFirebaseObject());

    await database.write(async () => {
      await todo.update(record => {
        record.isSynced = true;
        record.localSyncStatus = 'synced';
      });
    });

    console.log(`Updated todo synced: ${todo.firebaseId}`);
  }

  private async syncDeletedTodo(todo: Todo): Promise<void> {
    if (todo.firebaseId) {
      await firestore()
        .collection('Todo')
        .doc(todo.firebaseId)
        .delete();
    }

    await database.write(async () => {
      await todo.destroyPermanently();
    });

    console.log(`Deleted todo removed: ${todo.firebaseId || todo.id}`);
  }

  // Pull data from Firebase to local DB
  async pullFromFirebase(): Promise<void> {
    const isOnline = await this.checkConnection();
    if (!isOnline) {
      console.log('Cannot pull - device is offline');
      return;
    }

    console.log('Pulling data from Firebase...');

    try {
      const snapshot = await firestore().collection('Todo').get();
      const todosCollection = database.get<Todo>('todos');

      await database.write(async () => {
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const firebaseId = doc.id;

          const existingTodos = await todosCollection.query(
            Q.where('firebase_id', firebaseId)
          ).fetch();

          if (existingTodos.length > 0) {
            const existing = existingTodos[0];
            if (existing.isSynced) {
              await existing.update(record => {
                record.name = data.name;
                record.age = data.age;
                record.isChecked = data.isChecked || false;
              });
            }
          } else {
            await todosCollection.create(todo => {
              todo.firebaseId = firebaseId;
              todo.name = data.name;
              todo.age = data.age;
              todo.isChecked = data.isChecked || false;
              todo.isSynced = true;
              todo.localSyncStatus = 'synced';
            });
          }
        }
      });

      console.log('Pull from Firebase completed');
    } catch (error) {
      console.error('Failed to pull from Firebase:', error);
    }
  }

  // Full bidirectional sync
  async fullSync(): Promise<void> {
    console.log('Starting full sync...');
    await this.syncToFirebase();
    await this.pullFromFirebase();
    console.log('Full sync completed');
    this.notifySyncComplete();
  }
}

// Export singleton instance
export const syncService = new SyncService();
export default syncService;
