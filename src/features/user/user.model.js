import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class UserModel {
  constructor(username, email, password, type, id) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  static getAll() {
    return users;
  }
}

let users = [
  {
    id: 1,
    username: "sellerUser",
    email: "seller@ecom.com",
    password: "admin123",
    type: "Seller",
  },
  {
    id: 2,
    username: "CustomerUser",
    email: "customer@ecom.com",
    password: "admin1234",
    type: "Customer",
  },
];
