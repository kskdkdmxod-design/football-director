const BASE_URL = "https://v3.football.api-sports.io";

async function callApi(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/${endpoint}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    headers: {
      "x-apisports-key": process.env.API_FOOTBALL_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API-Football hatası: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.response;
}

export async function findTeam(name) {
  const teams = await callApi("teams", { search: name });
  return teams;
}

export async function getSquad(teamId) {
  const result = await callApi("players/squads", { team: teamId });
  return result?.[0]?.players ?? [];
}

export async function getFixtures(teamId, { last, next } = {}) {
  const params = { team: teamId };
  if (last) params.last = last;
  if (next) params.next = next;
  return callApi("fixtures", params);
}

export async function getFixturePlayerStats(fixtureId) {
  return callApi("fixtures/players", { fixture: fixtureId });
}

export async function getStandings(leagueId, season) {
  return callApi("standings", { league: leagueId, season });
}

export async function searchPlayers(name) {
  return callApi("players", { search: name });
}

export const LEAGUES = {
  premier_league: 39,
  la_liga: 140,
  serie_a: 135,
  bundesliga: 78,
  ligue_1: 61,
  super_lig: 203,
  eredivisie: 88,
  primeira_liga: 94,
  belgian_pro_league: 144,
  austrian_bundesliga: 218,
};
