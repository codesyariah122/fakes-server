import express from "express";
import jsonServer from "json-server";
import dotenv from "dotenv";
import db from "./todos.json";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";
import { timeAgo, getFormattedDate } from "./helpers.js";

dotenv.config();

const server = jsonServer.create();
const router = jsonServer.router("packages.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 6666;
const baseUrl = process.env.BASEURL || "http://localhost:6666"
const __dirname = dirname(fileURLToPath(import.meta.url));

server.use(middlewares);
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.use("/public", express.static(path.join(__dirname, "public")));

server.get("/", (req, res) => {
  res.json({
    message: "Welcome To JSON SERVER",
    api: {
      allpackages: `${baseUrl}:${port}/packages`,
      productPermalink: `${baseUrl}:${port}/packages/:permalink`,
    },
  });
});

server.get("/menus", (req, res) => {
  try {
    let menus = db.menus.data.map((d) => d);
  
    res.json({
      message: "List of todo menus",
      data: menus
    });
  } catch (e) {
    console.error(e);
  }
})


server.get("/list-todos", (req, res) => {
  try {
    let todos = db.todos.data.map((d) => d);

    res.json({
      message: "List of todos",
      data: todos,
    });

  } catch (e) {
    console.error(e);
  }
});

server.get("/todos-status", (req, res) => {
  try {
    let todosStatus = db.todos_status.data.map((d) => d);
  
    res.json({
      message: "List of todo status",
      data: todosStatus
    });
  } catch (e) {
    console.error(e);
  }
})

server.get("/todos-type", (req, res) => {
  try {
    let todoType= db.todos_type.data.map((d) => d);
  
    res.json({
      message: "List of todo type",
      data: todoType
    });
  } catch (e) {
    console.error(e);
  }
})

server.get("/packages/:permalink", (req, res) => {
  let permalink = req.params.permalink;
  console.log(permalink);

  let product = db.packages.data.map((d) => d);

  res.json({
    message: "Detail Product Page",
    data: product.find((d) => d.permalink == permalink),
  });
});

server.post("/todos/add", (req, res) => {
  const postData = req.body;
  console.log(postData)
  const addData = JSON.stringify(postData);
  const newData = JSON.parse(addData);
  const date = new Date();
  const timeDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );

  fs.readFile("./todos.json", "utf-8", (err, data) => {
    const databases = JSON.parse(data);
    const todos = databases.todos.data.map((d) => d);
    const find = todos.find((d) => d.todo_name === postData.todo_name);
    const lastId =
      find === undefined ? parseInt(todos.pop().id) : parseInt(find.id);

    if (err) {
      console.log(`Error add data : ${err}`);
      res
        .json({
          message: `Error add data : ${err}`,
        })
        .status(404);
    } else {
      if (find) {
        res.status(401).json({
          message: `${postData.todo_name}, is already in databases`,
        });
      } else {
        const finishData = {
          id: parseInt(lastId + 1),
          todo_name: newData.todo_name,
          percentage: 0,
          created_by: newData.created_by ? newData.created_by : null,
          last_reviewed_by: newData.last_reviewed_by ? newData.last_reviewed_by : null,
          date_added: date,
          date_modified: date,
          date_approved: null,
          status: 4,
          type: newData.type,
          description: newData.description
        };

        databases.todos.data.push(finishData);

        fs.writeFile(
          "./todos.json",
          JSON.stringify(databases, null, 4),
          (err) => {
            if (err) {
              console.log(`Error writing data : ${err}`);
            }
          }
        );
        res
          .json({
            message: `${postData.todo_name} has been added to database todos`,
            data: finishData,
          })
          .status(200);
      }
    }
  });
});

server.put("/package/update/:id", (req, res) => {
  let id = JSON.parse(parseInt(req.params.id));
  fs.readFile("./packages.json", "utf-8", (err, data) => {
    const databases = JSON.parse(data);
    const packages = databases.packages.data.map((d) => d);
    const find = packages.find((d) => d.id === id);

    if (err) {
      console.log(`Error add data : ${err}`);
      res
        .json({
          message: `Error add data : ${err}`,
        })
        .status(404);
    } else {
      if (find) {
        const updateData = JSON.stringify(req.body);
        const newData = JSON.parse(updateData);
        find.id = id;
        find.name = newData.name;
        find.permalink = newData.permalink;
        find.photo = newData.photo;
        find.description = newData.description;
        find.price = newData.price;

        fs.writeFile(
          "./packages.json",
          JSON.stringify(databases, null, 4),
          (err) => {
            if (err) {
              console.log(`Error writing data : ${err}`);
            }
          }
        );
        res
          .json({
            message: `Product with ID : ${id} has been updated to database packages`,
            data: newData,
          })
          .status(200);
      } else {
        console.log("data tidak ditemukan");
      }
    }
  });
});

server.use(router);

server.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
