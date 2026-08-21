import { getClubState } from "../../lib/store";
import { getSquad } from "../../lib/apiFootball";

export default async function handler(req, res) {
  try {
    const state = await getClubState();
    if (!state?.clubTeamId) {
      return res.status(400).json({ error: "Önce bir kulüp seçilmeli" });
    }

    const players = await getSquad(state.clubTeamId);

    const enriched = players.map((p) => {
      const ownRecord = state.squad.find((s) => s.playerId === p.id);
      return {
        ...p,
        acquiredOn: ownRecord?.acquiredOn ?? null,
        fee: ownRecord?.fee ?? null,
      };
    });

    return res.status(200).json(enriched);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
