import { getClubState, createClub } from "../../lib/store";
import { findTeam } from "../../lib/apiFootball";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const state = await getClubState();
      return res.status(200).json(state);
    }

    if (req.method === "POST") {
      const { clubName } = req.body;
      if (!clubName) {
        return res.status(400).json({ error: "clubName gerekli" });
      }

      const teams = await findTeam(clubName);
      if (!teams || teams.length === 0) {
        return res.status(404).json({ error: "Kulüp bulunamadı" });
      }

      const team = teams[0].team;
      const state = await createClub({
        clubName: team.name,
        clubTeamId: team.id,
        startingCash: 50000000,
        wageBudgetWeekly: 2000000,
        sponsorshipWeekly: 300000,
      });

      return res.status(200).json(state);
    }

    return res.status(405).json({ error: "Desteklenmeyen metod" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
