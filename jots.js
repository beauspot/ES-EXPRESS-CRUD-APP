/**
 * Pagination in Express.js is a technique used to divide large sets of data into smaller chunks called "pages". This is useful when you want to display data in a web application in a user-friendly way, without overwhelming the user with a large amount of data all at once.

To implement pagination in Express.js using ES6 syntax, you can use the limit and skip methods of the Mongoose query object. Here's an example:
 */

// import necessary modules
/* import express from "express";
import mongoose from "mongoose";

// create express app
const app = express();

// connect to MongoDB
mongoose.connect("mongodb://localhost/mydb", { useNewUrlParser: true });

// define schema and model
const mySchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const MyModel = mongoose.model("MyModel", mySchema);

// define route for paginated results
app.get("/mydata", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // calculate the number of documents to skip
  const skip = (page - 1) * pageSize;

  MyModel.find()
    .skip(skip)
    .limit(pageSize)
    .exec((err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching data" });
      }

      MyModel.countDocuments().exec((err, count) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error fetching data" });
        }

        const totalPages = Math.ceil(count / pageSize);

        return res.json({
          data,
          pagination: {
            page,
            pageSize,
            totalPages,
            totalItems: count,
          },
        });
      });
    });
});

// start the server
app.listen(3000, () => {
  console.log("Server started on port 3000"); 
});*/

/**In this example, we create an Express.js app and connect it to a MongoDB database using Mongoose. We define a schema and model for the data we want to paginate. We then define a route for retrieving paginated results. The route accepts two query parameters: page and pageSize, which specify the current page number and the number of items to display per page, respectively.

We calculate the number of documents to skip based on the page and pageSize parameters, and use the Mongoose skip and limit methods to retrieve the desired page of data. We also use the countDocuments method to get the total number of items in the collection, so we can calculate the total number of pages.

Finally, we return the paginated data and pagination information as a JSON response.

To modularize this codebase, we can split it into multiple files. For example, we can create a db.js file to handle the database connection and export the Mongoose model: */

// db.js
/* 
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true });

const mySchema = new mongoose.Schema({
  name: String,
  age: Number
});

export default mongoose.model('MyModel', mySchema); */

/**We can then create a separate file for the Express.js app and define the route for paginated results: */

// app.js

/* import express from 'express';
import MyModel from './db.js';

const app = express();

app.get('/mydata', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize)


   .exec((err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ ErrorMessage: "Error Fetching data" });
      }
    });

  // execute the query with exec
  const result = await getAlltasks.exec();
  if (!result) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: "Error Fetching Data" });
  } else {
    res.json({ paginatedData: result });
  }

  // implementing navigation in a paginated data 
 const Task = require('../models/task');

const getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const skip = (page - 1) * pageSize;

  try {
    const tasks = await Task.find().skip(skip).limit(pageSize);
    const count = await Task.countDocuments();
    const totalPages = Math.ceil(count / pageSize);

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    const baseUrl = `${req.protocol}://${req.hostname}:${process.env.PORT || 3000}${req.baseUrl}`;

    const links = {};
    if (page > 1) {
      links.first = `${baseUrl}?page=1`;
      links.prev = `${baseUrl}?page=${page - 1}`;
    }
    if (page < totalPages) {
      links.next = `${baseUrl}?page=${page + 1}`;
      links.last = `${baseUrl}?page=${totalPages}`;
    }

    return res.json({
      tasks,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalItems: count,
        links
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
};

module.exports = { getTasks };
 */