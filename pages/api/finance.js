import { getClubState, saveClubState } from "../../lib/store";
import { advanceWeek, takeLoan, repayDebt } from "../../lib/finance";

export default async function handler(req, res) {
  try {
    const state = await getClubState();
    if (!state?.clubTeamId) {
      return res.status(400).json({ error: "Önce bir kulüp seçilmeli" });
    }

    if (req.method === "GET") {
      return res.status(200).json(state.finance);
    }

    if (req.method === "POST") {
      const { action, amount } = req.body;

      if (action === "advanceWeek") {
        advanceWeek(state);
      } else if (action === "loan") {
        if (!amount || amount <= 0) return res.status(400).json({ error: "Geçerli bir tutar gir" });
        takeLoan(state, amount);
      } else if (action === "repay") {
        if (!amount || amount <= 0) return res.status(400).json({ error: "Geçerli bir tutar gir" });
        repayDebt(state, amount);
      } else {
        return res.status(400).json({ error: "Bilinmeyen aksiyon" });
      }

      await saveClubState(state);
      return res.status(200).json(state.finance);
    }

    return res.status(405).json({ error: "Desteklenmeyen metod" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
