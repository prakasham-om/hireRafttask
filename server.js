const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDataBase = require("./config/database");

const cloudinary = require('cloudinary')




// database connection
mongoose.set("strictQuery", true);
connectDataBase();



cloudinary.config({
  cloude_name : process.env.CLOUDINARY_NAME,
  api_key :process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

// Server runnig 
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is starting on port:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});





// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
