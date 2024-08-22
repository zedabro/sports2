const jwt = require("jsonwebtoken");
const pool = require("./db");

const authenticatePersonal = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      "SELECT * FROM personal_ventas WHERE id_personal = ?",
      [decoded.id_personal]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.personal = rows[0];
    next();
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return res.status(401).json({ message: "Failed to authenticate token" });
  }
};

module.exports = authenticatePersonal;
