import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrpt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    const { username, email, password, type } = req.body;

    const hashedPassword = await bcrpt.hash(password, 10);

    const newUser = new UserModel(username, email, hashedPassword, type);
    await this.userRepository.signUp(newUser);
    res.status(201).send(newUser);
  }

  async signIn(req, res) {
    try {
      // 1. Find user by email
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        return res.status(400).send({ message: "Incorrect Credentials" });
      } else {
        //2. compare password with hashed password
        const result = await bcrpt.compare(req.body.password, user.password);

        if (result) {
          // 3. generate JWT token
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          //  4. send the token in response
          return res.status(200).send(token);
        } else {
          return res.status(400).send({ message: "Incorrect Credentials" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  }

  async resertPassword(req, res, next) {
    const {newPassword} = req.body;
    const userID = req.userID;
    const hashedPassword = await bcrpt.hash(newPassword, 12); 

    try{
      await this.userRepository.resetPassword(userID, hashedPassword);
      return  res.status(200).send({message: "Password reset successful"});
      
      

    }catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong" });
    }

  }
}
