import express from "express"; // Imports the Express framework for building web applications
import multer from "multer"; // Imports the Multer middleware for handling multipart/form-data requests (file uploads)
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Imports the functions for handling post-related actions from the `postsController.js` file
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

const storage = multer.diskStorage({ // Configures Multer's storage for uploaded files
  destination: function (req, file, cb) { // Defines the destination folder for uploaded files
    cb(null, 'uploads/'); // Sets the destination folder as 'uploads/'
  },
  filename: function (req, file, cb) { // Defines the naming convention for uploaded files
    cb(null, file.originalname); // Uses the original filename of the uploaded file
  }
});

const upload = multer({ dest: "./uploads", storage }); // Creates a Multer instance with the defined storage configuration

const routes = (app) => { // Defines a function that sets up routes for the application

  // Enables Express to parse incoming JSON data in request bodies
  app.use(express.json());
  app.use(cors(corsOptions));
  // Defines a route for GET requests to `/posts`
  app.get("/posts", listarPosts); // Calls the `listarPosts` function from the controller to handle this route

  // Defines a route for POST requests to `/posts`
  app.post("/posts", postarNovoPost); // Calls the `postarNovoPost` function from the controller to handle this route

  // Defines a route for POST requests to `/upload` with Multer middleware for handling a single file named "imagem"
  app.post("/upload", upload.single("imagem"), uploadImagem); // Calls the `uploadImagem` function from the controller after Multer handles the file upload

  app.put("/upload/:id", atualizarNovoPost);

};

export default routes; // Exports the `routes` function to be used in the main application file