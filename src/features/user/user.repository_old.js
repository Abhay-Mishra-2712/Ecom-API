import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {

  constructor(){
        this.collection= "users";
    }
  async signUp(newUser) {
    try {
      // 1. Get the Database

      const db = getDB();

      // 2. Get the  collection
      const collection = db.collection(this.collection);

      //3. Insert the new doccument

      await collection.insertOne(newUser);
      return newUser;
    } catch (error) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async signIn(email, password) {
    try {
      // 1. Get the Database

      const db = getDB();

      // 2. Get the  collection
      const collection = db.collection(this.collection);

      //3. find the user document

      return await collection.findOne({ email, password });
    } catch (error) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async findByEmail(email) {
    try {
      // 1. Get the Database

      const db = getDB();

      // 2. Get the  collection
      const collection = db.collection("users");

      //3. find the user document

      return await collection.findOne({ email});
    } catch (error) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
}

export default UserRepository;
