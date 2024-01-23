import express from "express";
import Products from "../schemas/products.schema.js";
const router = express.Router();
//상품 등록 API
router.post("/products", async (req, res, next) => {
  const { title, content, author, password, createdAt } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  const productsstatus = await Products.findOne().exec();
  const status = productsstatus ? "FOR_SALE" : "SOLD_OUT";
  const products = new Products({ title, content, author, password, status });
  products.createdAt = new Date();
  await products.save();
  return res.status(201).json({ message: "판매 상품을 등록하였습니다" });
});

//상품 목록 조회 API

router.get("/products", async (req, res, next) => {
  const products = await Products.find()
    .select("title author status createdAt")
    .sort("-createdAt")
    .exec();
  if (!products) {
    return res.status(404).json({ products });
  }
  return res.status(200).json({ products });
});

// 상품 상세 조회 API
router.get("/products/:productId", async (req, res) => {
  const products = await Products.findById(req.params.productId)
    .select("title content author status createdAt")
    .sort("-createdAt")
    .exec();
  if (!products) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다" });
  }
  return res.status(200).json({ products });
});

//상품 정보 수정 API

router.put("/products/:productsId", async (req, res) => {
  const { productsId } = req.params;
  const { title, content, password, status } = req.body;

  const currentproducts = await Products.findById(productsId).exec();
  if (!currentproducts) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
  if (!title || !content || !password || !status) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (password != currentproducts.password) {
    return res
      .status(401)
      .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  }
  currentproducts.title = title;
  currentproducts.content = content;
  currentproducts.status = status;

  await currentproducts.save();

  const updatedProducts = await Products.find()
    .select("title author status createdAt")
    .sort("-createdAt")
    .exec();
  return res
    .status(200)
    .json({ message: "상품 정보를 수정하였습니다", Products: updatedProducts });
});

//상품 정보 삭제 API
router.delete("/products/:productsId", async (req, res, next) => {
  const { password } = req.body;
  const { productsId } = req.params;
  const products = await Products.findById(productsId).exec();
  if (!products) {
    return res.status(404).json({ Message: "상품 조회에 실패하였습니다" });
  }
  if (!productsId) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (password != products.password) {
    return res
      .status(401)
      .json({ message: "상품을 삭제할 권한이 존재하지 않습니다." });
  }
  await Products.deleteOne({ _id: productsId });
  return res.status(200).json({ message: "상품을 삭제하였습니다" });
});
export default router;
