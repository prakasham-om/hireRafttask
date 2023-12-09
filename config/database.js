const mongoose = require("mongoose");
require("dotenv").config();
const connectDataBase = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DATABASE_CLOUD, {
      useUnifiedTopology: true
    })
    .then((con) => {
      console.log("DB connected");
     })
     //.catch((err)=>{
    //   console.log(err)
    // })
};
module.exports = connectDataBase;
