import Product from "../models/Product.js";

class ProductController {
  async GetAll(req, res) {
    try {
      const products = await Product.find()
      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ message: "Ошибка при получении товаров: " + err.message })
    }
  }

  async Create(req, res) {
    try {
      const { brand, model, title, description, price, quantity, storage, color, screen, camera, battery, os, cpu, ram } = req.body;
      const product = await Product.create({
        brand, model, title, description, price, quantity, storage, color,
        specs: { screen, camera, battery, os, cpu, ram }
      })
      res.status(201).json(product)
    } catch (err) {
      res.status(400).json({ message: "Ошибка при создании товара: " + err.message })
    }
  }


  async update(req, res){
    try{ 
      const { id } = req.params
      const { brand, model, title, description, price, quantity, storage, color, screen, camera, battery, os, cpu, ram } = req.body;
      const updates = await Product.findByIdAndUpdate(id,{
        brand, model, title, description, price, quantity, storage, color, screen, camera, battery, os, cpu, ram,
        specs: { screen, camera, battery, os, cpu, ram }
      }, {new: true})
      if(!updates){
        res.status(400).json({message :"Такога товара не существует"})
      }
      res.status(200).json(updates)
    }catch(err){
      res.status(500).json({message: "Ошибка при обновление"})
    }
  }


  async delet(req, res){
    try{
      const { id } = req.params
      const product = await Product.findByIdAndDelete(id)
        if(!product){
                res.status(404).json("Такого продокуда не существует ")
            }
            res.status(200).json("Продукт  успешно удален")
    }catch(err){
      res.status(500).json("Ошибка при выполнении запроса:" + err)
    }

    
  }
}

export default new ProductController();
