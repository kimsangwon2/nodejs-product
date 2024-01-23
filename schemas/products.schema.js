import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
productsSchema.virtual("productsId").get(function () {
  return this._id.toHexString();
});
productsSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("products", productsSchema);
