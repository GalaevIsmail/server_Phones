import User from "../models/User.js";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";

const publicUser = (u) => ({
  id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  avatar: u.avatar,
  role: u.role,
});

class UserController {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Пароль должен быть не короче 6 символов" });
      }

      const exists = await User.findOne({ email: email.toLowerCase().trim() });
      if (exists) {
        return res.status(400).json({ message: "Пользователь с такой почтой уже существует" });
      }

      const hash = await passwordService.hashPassword(password);
      const newUser = await User.create({ firstName, lastName, email, password: hash });
      const token = tokenService.generateToken(newUser._id);

      return res.status(201).json({ token, user: publicUser(newUser) });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка при регистрации: " + err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email и пароль обязательны для заполнения" });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
      if (!user) {
        return res.status(400).json({ message: "Неверный email или пароль" });
      }

      const isPassword = await passwordService.comparePassword(password, user.password);
      if (!isPassword) {
        return res.status(400).json({ message: "Неверный email или пароль" });
      }

      const token = tokenService.generateToken(user._id);
      return res.status(200).json({ token, user: publicUser(user) });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка при авторизации: " + err.message });
    }
  }

  async getMe(req, res) {
    const { _id, firstName, lastName, email, avatar, role } = req.user
    res.json({ _id, firstName, lastName, email, avatar, role })
  }
}

export default new UserController();
