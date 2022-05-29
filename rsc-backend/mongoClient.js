const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://tim:${process.env.MONGO_PW}@cluster0.l9vlx.mongodb.net/RSC?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

mongoClient.connect((err) => {
  if (err) {
    console.log("Error connecting to the DB: " + err);
    return;
  }
  console.log("Connected to DB");
});

module.exports = {
  mongoClient,
};
