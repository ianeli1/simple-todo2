import { Migration } from '@mikro-orm/migrations';

export class Migration20201004220250 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "to_do" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" varchar(255) not null, "done" bool not null);');
  }

}
