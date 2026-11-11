const crypto = require("crypto");
const store = require("./_store");
const { isAdmin } = require("./_auth");

const TYPES = ["action", "etf", "obligation", "crypto", "autre"];
const RISKS = ["faible", "modere", "eleve"];
const str = (v, n) => String(v == null ? "" : v).slice(0, n);
const num = (v) => (typeof v === "number" && isFinite(v) ? v : null);

/* Ne garde que les champs connus, avec le bon type. */
function clean(b) {
  const conf = num(b.confidence);
  const div = num(b.dividend);
  return {
    status: "achete",
    type: TYPES.includes(b.type) ? b.type : "autre",
    name: str(b.name, 120),
    ticker: str(b.ticker, 20),
    isin: str(b.isin, 12).toUpperCase(),
    date: str(b.date, 10),
    amount: num(b.amount),
    price: num(b.price),
    dividend: div != null && div >= 0 && div <= 100 ? div : null,
    divEst: b.divEst === true,
    confidence: conf != null && conf >= 1 && conf <= 10 ? Math.round(conf) : null,
    risk: RISKS.includes(b.risk) ? b.risk : null,
    note: str(b.note, 1000),
    createdAt: num(b.createdAt) || Date.now(),
  };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      res.status(200).json(await store.list());
      return;
    }
    if (!isAdmin(req)) { res.status(401).json({ error: "non autorisé" }); return; }
    if (req.method === "POST") {
      const b = req.body || {};
      const item = clean(b);
      if (!item.name) { res.status(400).json({ error: "nom manquant" }); return; }
      const id = /^[A-Za-z0-9_-]{6,64}$/.test(b.id || "") ? b.id : crypto.randomUUID();
      await store.save(id, item);
      res.status(200).json({ id });
      return;
    }
    if (req.method === "DELETE") {
      const id = String((req.query && req.query.id) || "");
      if (!/^[A-Za-z0-9_-]{6,64}$/.test(id)) { res.status(400).json({ error: "id invalide" }); return; }
      await store.remove(id);
      res.status(200).json({ ok: true });
      return;
    }
    res.status(405).json({ error: "méthode non autorisée" });
  } catch (e) {
    res.status(500).json({ error: "erreur serveur" });
  }
};
