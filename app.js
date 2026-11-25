import "dotenv/config"
import express from "express"

import connectDB from "./src/config/db.js"

import productRoutes from "./src/routes/productRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"

const app = express()

connectDB()

app.use(express.json())
app.use(express.static("public"))

app.use("/api/product", productRoutes)
app.use("/api/user", userRoutes)

const PORT =  6000

app.listen(PORT, () => {
  console.log("Сервер успешно запущен:" + PORT)
})
