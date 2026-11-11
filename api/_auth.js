const crypto = require("crypto");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();

/* Compare le mot de passe envoyé à ADMIN_PASSWORD, en temps constant. */
function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const given = req.headers["x-admin-password"] || "";
  return crypto.timingSafeEqual(sha(given), sha(expected));
}
module.exports = { isAdmin, sha };
