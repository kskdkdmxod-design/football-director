import { recordTransfer } from "../../../lib/store";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Desteklenmeyen metod" });
    }

    const { playerId, name, fromClub, fee } = req.body;
    if (!playerId || !name || fee === undefined) {
      return res.status(400).json({ error: "playerId, name ve fee gerekli" });
    }

    const state = await recordTransfer({ playerId, name, fromClub, fee });
    return res.status(200).json(state);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
