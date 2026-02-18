// productID ,UserID , quantity .

export default class CartItemModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this.id = id;
  }

  static addItem(productID, userID, quantity) {
    const newItem = new CartItemModel(productID, userID, quantity);
    newItem.id = cartItems.length + 1; // Simple ID assignment

    cartItems.push(newItem);
    return newItem;
  }

  static getItemsByUser(userID) {
    return cartItems.filter((item) => item.userID == userID);
  }

  static deleteItem(cartItemID, userID) {
    const cartItemIndex = cartItems.findIndex(
      (item) => item.id == cartItemID && item.userID == userID
    );
    if (cartItemIndex == -1) {
      return { error: "Cart item not found" };
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
  }
}

var cartItems = [new CartItemModel(1, 2, 1, 1), new CartItemModel(1, 1, 2, 1)];
