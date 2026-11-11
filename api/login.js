const { isAdmin } = require("./_auth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.status(405).json({ error: "méthode non autorisée" }); return; }
  const pwd = (req.body && req.body.password) || "";
  req.headers["x-admin-password"] = pwd;
  if (isAdmin(req)) { res.status(200).json({ ok: true }); return; }
  await new Promise((r) => setTimeout(r, 800)); // freine les essais répétés
  res.status(401).json({ error: "mot de passe incorrect" });
};
