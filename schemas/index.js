import mongoose from "mongoose";
import env from "dotenv";
env.config();
const { mongodburi, dbname } = process.env;

const connect = () => {
  mongoose
    .connect(mongodburi, {
      dbname: dbname,
    })
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default connect;
