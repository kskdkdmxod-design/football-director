import { kv } from "@vercel/kv";
import { addTransaction } from "./finance";

const SAVE_KEY = "club:save";

const DEFAULT_STATE = {
  clubName: null,
  clubTeamId: null,
  squad: [],
  transferLog: [],
  finance: {
    cash: 0,
    wageBudgetWeekly: 0,
    sponsorshipWeekly: 0,
    debt: 0,
    lastWeekProcessed: null,
    lastMatchdayFixtureId: null,
    transactions: [],
  },
  createdAt: null,
};

export async function getClubState() {
  const state = await kv.get(SAVE_KEY);
  return state || null;
}

export async function saveClubState(state) {
  await kv.set(SAVE_KEY, state);
  return state;
}

export async function createClub({ clubName, clubTeamId, startingCash, wageBudgetWeekly, sponsorshipWeekly }) {
  const state = {
    ...DEFAULT_STATE,
    clubName,
    clubTeamId,
    finance: {
      ...DEFAULT_STATE.finance,
      cash: startingCash,
      wageBudgetWeekly,
      sponsorshipWeekly,
    },
    createdAt: new Date().toISOString(),
  };
  await saveClubState(state);
  return state;
}

export async function recordTransfer({ playerId, name, fromClub, fee }) {
  const state = await getClubState();
  if (!state) throw new Error("Önce bir kulüp seçilmeli");
  if (fee > state.finance.cash) throw new Error("Kulüp kasasında yeterli bakiye yok");

  state.squad.push({
    playerId,
    name,
    acquiredOn: new Date().toISOString(),
    fee,
  });
  state.transferLog.push({
    playerId,
    name,
    fromClub,
    toClub: state.clubName,
    date: new Date().toISOString(),
    fee,
  });

  addTransaction(state, {
    category: "transferGiderleri",
    type: "expense",
    amount: fee,
    note: `${name} transferi`,
  });

  await saveClubState(state);
  return state;
}
