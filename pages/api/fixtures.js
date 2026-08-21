import { getClubState, saveClubState } from "../../lib/store";
import { getFixtures, getFixturePlayerStats } from "../../lib/apiFootball";
import { recordMatchdayIncome } from "../../lib/finance";

export default async function handler(req, res) {
  try {
    const state = await getClubState();
    if (!state?.clubTeamId) {
      return res.status(400).json({ error: "Önce bir kulüp seçilmeli" });
    }

    const [lastFixtures, nextFixtures] = await Promise.all([
      getFixtures(state.clubTeamId, { last: 1 }),
      getFixtures(state.clubTeamId, { next: 1 }),
    ]);

    const lastMatch = lastFixtures?.[0] ?? null;
    let lastMatchPlayerStats = null;

    if (lastMatch) {
      lastMatchPlayerStats = await getFixturePlayerStats(lastMatch.fixture.id);

      const isFinished = lastMatch.fixture.status?.short === "FT";
      const alreadyRecorded = state.finance.lastMatchdayFixtureId === lastMatch.fixture.id;

      if (isFinished && !alreadyRecorded) {
        recordMatchdayIncome(state, lastMatch);
        await saveClubState(state);
      }
    }

    return res.status(200).json({
      lastMatch,
      nextMatch: nextFixtures?.[0] ?? null,
      lastMatchPlayerStats,
      finance: state.finance,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
