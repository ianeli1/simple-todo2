import express from "express";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import config from "./mikro-orm.config";
import { ToDo } from "./entities/ToDo";

const app = express();
const port = 5000;

//do shit
const main = async () => {
  const orm = await MikroORM.init(config);
  const todoRepo = orm.em.getRepository(ToDo);
  await orm.getMigrator().up();
  app.use(express.json());
  app.use((_req, _res, next) => RequestContext.create(orm.em, next));

  app.get("/todos", async (_req, res) => {
    //get everything
    try {
      const todos = await todoRepo.findAll();
      res.json(todos);
    } catch (e) {
      console.error(e);
    }
  });

  app.get("/todos/:id", async (req, res) => {
    //get a specific item
    try {
      if (parseInt(req.params.id)) {
        const todo = await orm.em.find(ToDo, { id: parseInt(req.params.id) });
        res.json(todo);
      } else {
        res.json({ message: "ID is not a number" });
      }
    } catch (e) {
      console.error(e);
      res.json({ message: "An unhandled error ocurred" });
    }
  });

  app.post("/todos", async (req, res) => {
    //create a new one
    if (req.body.content) {
      try {
        const todo = orm.em.create(ToDo, { content: req.body.content });
        await orm.em.persistAndFlush(todo);
        res.status(200);
        res.json({ message: "OK" });
      } catch (e) {
        console.error(e);
      }
    } else {
      res.status(400);
      res.json({ message: "body.content is not valid" });
    }
  });

  app.put("/todos/:id", async (req, res) => {
    if (parseInt(req.params.id) && req.body.content) {
      const todo = await orm.em.findOne(ToDo, { id: parseInt(req.params.id) });
      if (todo) {
        todo.content = req.body.content;
        await orm.em.persistAndFlush(todo);
        res.json(todo);
      } else {
        res.status(404);
        res.json({ message: "The ID doesn't exist in the DB" });
      }
    } else {
      res.status(400);
      res.json({ message: "Missing or invalid parameters" });
    }
    //edit
  });

  app.delete("/todos/:id", async (req, res) => {
    if (parseInt(req.params.id)) {
      const todo = await orm.em.findOne(ToDo, { id: parseInt(req.params.id) });
      if (todo) {
        await orm.em.removeAndFlush(todo);
        res.status(200);
        res.json({ message: "OK" });
      } else {
        res.status(404);
        res.json({ message: "Not found" });
      }
    } else {
      res.status(400);
      res.json({ message: "Invalid ID" });
    }
  });

  //start the server

  app.listen(
    port,
    () => void console.log(`Server is now listening on port ${port}!`)
  );
};

main().catch((e) => console.error(e));
