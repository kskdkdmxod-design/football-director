const WAGE_PER_PLAYER_WEEKLY = 25000;
const HOME_MATCHDAY_INCOME = 800000;
const AWAY_MATCHDAY_INCOME = 150000;
const BROADCAST_INCOME_PER_MATCH = 450000;

export function addTransaction(state, { category, type, amount, note }) {
  state.finance.transactions.unshift({
    date: new Date().toISOString(),
    category,
    type,
    amount,
    note: note || "",
  });
  state.finance.cash += type === "income" ? amount : -amount;
  return state;
}

export function computeWeeklyWageExpense(state) {
  const squadSize = state.squad.length || 0;
  return squadSize * WAGE_PER_PLAYER_WEEKLY;
}

export function advanceWeek(state) {
  const wageExpense = computeWeeklyWageExpense(state);

  addTransaction(state, {
    category: "sponsorlukGelirleri",
    type: "income",
    amount: state.finance.sponsorshipWeekly,
    note: "Haftalık sponsorluk geliri",
  });

  addTransaction(state, {
    category: "maasGiderleri",
    type: "expense",
    amount: wageExpense,
    note: `${state.squad.length} oyuncu maaşı`,
  });

  state.finance.lastWeekProcessed = new Date().toISOString();
  return state;
}

export function recordMatchdayIncome(state, fixture) {
  const isHome = fixture.teams.home.id === state.clubTeamId;
  const matchdayIncome = isHome ? HOME_MATCHDAY_INCOME : AWAY_MATCHDAY_INCOME;

  addTransaction(state, {
    category: "macGunuGelirleri",
    type: "income",
    amount: matchdayIncome,
    note: `${fixture.teams.home.name} - ${fixture.teams.away.name}`,
  });

  addTransaction(state, {
    category: "yayinGelirleri",
    type: "income",
    amount: BROADCAST_INCOME_PER_MATCH,
    note: "Yayın geliri payı",
  });

  state.finance.lastMatchdayFixtureId = fixture.fixture.id;
  return state;
}

export function takeLoan(state, amount) {
  state.finance.debt += amount;
  addTransaction(state, {
    category: "borclar",
    type: "income",
    amount,
    note: "Alınan kredi",
  });
  return state;
}

export function repayDebt(state, amount) {
  const payAmount = Math.min(amount, state.finance.debt);
  state.finance.debt -= payAmount;
  addTransaction(state, {
    category: "borclar",
    type: "expense",
    amount: payAmount,
    note: "Borç ödemesi",
  });
  return state;
}
