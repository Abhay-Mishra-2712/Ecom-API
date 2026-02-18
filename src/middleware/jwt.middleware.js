import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  // 1.read  the token from Authorization header
  const token = req.headers["authorization"];

  // 2.If no token found, return 401 error
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // 3.Verify the token is valid or not
  try {
    const payload = jwt.verify(
      token,
      "cVelauxNdDohRwcl8kzB0UQlZWn4zonz1gPSpfaFGBA="
    );
    req.userID = payload.userID;
    console.log(payload);
  } catch (err) {
    // 4.If token is invalid, return 403 error
    return res.status(403).send("Unaouthorized");
  }

  // 5.If token is valid, call next()
  next();
};
export default jwtAuth;
