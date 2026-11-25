import User from "../models/User.js";
import tokenService from "../services/tokenService.js";

class Auth {
  async authUser(req, res, next) {
    try {
      const token = tokenService.extractToken(req)
      if (!token) {
        return res.status(401).json({ message: "Нет токена" })
      }
      const payload = tokenService.verifyToken(token)
      const user = await User.findById(payload.id)
      if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" })
      }
      req.user = user
      next()
    } catch (err) {
      res.status(401).json({ message: "Невалидный токен" })
    }
  }

  // Использовать после authUser
  adminOnly(req, res, next) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Доступно только администратору" })
    }
    next()
  }
}

export default new Auth()
