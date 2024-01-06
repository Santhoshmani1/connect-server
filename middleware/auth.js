import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
  console.log("createAccessToken");
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
};

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).send({ message: "Access denied, no token" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Access denied, invalid token" });
    } else {
      req.params.userId = user.userId;
      console.log(req.params.userId);
      next();
    }
  });
};
