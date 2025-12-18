import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export type LocalSyncStatus = 'synced' | 'created' | 'updated' | 'deleted';

export default class Todo extends Model {
  static table = 'todos';

  @text('firebase_id') firebaseId!: string;
  @text('name') name!: string;
  @field('age') age!: number;
  @field('is_checked') isChecked!: boolean;
  @field('is_synced') isSynced!: boolean;
  @text('sync_status') localSyncStatus!: LocalSyncStatus;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Helper method to prepare update
  async markForSync(status: LocalSyncStatus) {
    await this.update(record => {
      record.localSyncStatus = status;
      record.isSynced = false;
    });
  }

  // Prepare record for Firebase sync
  toFirebaseObject() {
    return {
      name: this.name,
      age: this.age,
      isChecked: this.isChecked,
    };
  }
}
