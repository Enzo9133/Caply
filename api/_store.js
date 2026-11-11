/* Accès à la base Upstash Redis (Vercel Marketplace), sans dépendance : simple appel HTTP. */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "journal:positions";

async function cmd(args) {
  if (!URL_ || !TOKEN) throw new Error("Base de données non configurée");
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

async function list() {
  const flat = (await cmd(["HGETALL", KEY])) || [];
  const out = [];
  for (let i = 0; i < flat.length; i += 2) {
    try {
      const d = JSON.parse(flat[i + 1]);
      d.id = flat[i];
      out.push(d);
    } catch (e) { /* ligne illisible ignorée */ }
  }
  return out;
}
const save = (id, item) => cmd(["HSET", KEY, id, JSON.stringify(item)]);
const remove = (id) => cmd(["HDEL", KEY, id]);

module.exports = { list, save, remove };
