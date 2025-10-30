const { average } = require("./compute");

/**
 * Count wins in last 5 matches for a player (array of 0/1)
 */
function countWins(lastMatches) {
  if (!Array.isArray(lastMatches)) return 0;
  return lastMatches.filter((m) => m === 1).length;
}

/**
 * Compute win ratios grouped by country
 * Input: array of players
 * Output: { best, worst } countries by win ratio
 */
function computeCountryWinRatios(players) {
  const countryStats = {};

  players.forEach((player) => {
    const code = player.country?.code;
    if (!code) return;

    const wins = countWins(player.data?.last || []);
    const total = (player.data?.last || []).length;

    if (!countryStats[code]) {
      countryStats[code] = { wins: 0, total: 0 };
    }

    countryStats[code].wins += wins;
    countryStats[code].total += total;
  });

  const ratios = Object.entries(countryStats)
    .map(([code, { wins, total }]) => ({
      code,
      winRatio: total > 0 ? parseFloat((wins / total).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.winRatio - a.winRatio);

  if (!ratios.length) return { best: null, worst: null };

  // --- Handle equalities ---
  const maxRatio = ratios[0].winRatio;
  const minRatio = ratios[ratios.length - 1].winRatio;

  const best = ratios.filter((c) => c.winRatio === maxRatio);
  const worst = ratios.filter((c) => c.winRatio === minRatio);

  return { best, worst };
}

module.exports = {
  countWins,
  computeCountryWinRatios,
};
