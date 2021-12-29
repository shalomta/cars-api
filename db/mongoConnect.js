const mongoose = require('mongoose');
const { config } = require("../config/secret_keys");

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://localhost:27017/yad2');
  await mongoose.connect(`mongodb+srv://${config.userBb}:${config.passDb}@cluster0.ztgni.mongodb.net/project_backend`);
  console.log("mongo connected");
}