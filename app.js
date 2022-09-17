const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const { status = "" } = request.query;
  const result = `select * from todo where status like '%${status}%';`;
  const result1 = await db.all(result);
  response.send(result1);
});

app.get("/todos/", async (request, response) => {
  const { priority = "" } = request.query;
  const result = `select * from todo 
  where priority like '%${priority}%';`;
  const result1 = await db.all(result);
  response.send(result1);
});

app.get("/todos/", async (request, response) => {
  const { status, priority } = request.query;
  const result = `select * from todo where 
  priority like '%${priority}%' and 
  status like '%${status}%';`;
  const result1 = await db.all(result);
  response.send(result1);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const result = `select * from todo where 
  todo like '%${search_q}%';`;
  const result1 = await db.all(result);
  response.send(result1);
});

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const result = `select * from todo where
  id='${todoId}';`;
  const result1 = await db.all(result);
  response.send(result1);
});

app.post("/todos/", async (request, response) => {
  const postbody = request.body;
  const { id, todo, priority, status } = postbody;
  const postQuery = `insert into todo (id,todo,priority,status)
    values ('${id}','${todo}','${priority}','${status}');`;
  await db.run(postQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const putQuery = request.body;
  const { todoId } = request.params;
  const { status } = putQuery;
  const result = `update todo set status='${status}'
    where id=${todoId};`;
  await db.run(result);
  response.send("Status Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const putQuery = request.body;
  const { priority } = putQuery;
  const result = `update todo set 
  priority='${priority}'
    where id=${todoId};`;
  await db.run(result);
  response.send("Priority Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const putQuery = request.body;
  const { todo } = putQuery;
  const result = `update todo set 
  todo='${todo}'
    where id=${todoId};`;
  await db.run(result);
  response.send("Todo Updated");
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const result = `select * from todo 
  where id=${todoId};`;
  const result1 = await db.all(result);
  response.send("Todo Deleted");
});

module.exports = app;
