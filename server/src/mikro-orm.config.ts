import { MikroORM } from "@mikro-orm/core";
import { ToDo } from "./entities/ToDo";
import path from "path";

export default {
  entities: [ToDo],
  dbName: "todos",
  type: "postgresql", // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  password: "postgre",
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
