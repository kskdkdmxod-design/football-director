import { searchPlayers } from "../../../lib/apiFootball";

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.length < 3) {
      return res.status(400).json({ error: "En az 3 karakter girilmeli" });
    }

    const players = await searchPlayers(q);
    return res.status(200).json(players);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
