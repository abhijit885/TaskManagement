import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export type LocalSyncStatus = 'synced' | 'created' | 'updated' | 'deleted';

export default class User extends Model {
  static table = 'users';

  @text('firebase_id') firebaseId!: string;
  @text('email') email!: string;
  @text('display_name') displayName!: string;
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
      email: this.email,
      displayName: this.displayName,
    };
  }
}
