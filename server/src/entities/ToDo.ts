import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class ToDo {
  @PrimaryKey({ serializedPrimaryKey: true })
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: "date" })
  updatedAt = new Date();

  @Property()
  content!: string;

  @Property()
  done: boolean = false;
}
