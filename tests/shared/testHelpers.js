/**
 * Factory pour créer des données de joueur valides selon le schéma Mongoose
 */
const createPlayerData = (overrides = {}) => ({
  id: 1,
  firstname: 'Test',
  lastname: 'Player',
  shortname: 'T.PLY',
  sex: 'M',
  country: {
    code: 'FRA',
    picture: 'https://example.com/flag.jpg',
  },
  picture: 'https://example.com/player.jpg',
  data: {
    rank: 10,
    points: 1000,
    weight: 75000, // en grammes
    height: 180, // en cm
    age: 25,
    last: [1, 0, 1, 1, 0],
  },
  ...overrides,
});

/**
 * Factory pour créer plusieurs joueurs
 */
const createPlayersData = (count = 3) => {
  const countries = [
    { code: 'FRA', name: 'France' },
    { code: 'ESP', name: 'Spain' },
    { code: 'USA', name: 'USA' },
    { code: 'GER', name: 'Germany' },
    { code: 'ITA', name: 'Italy' },
  ];
  const players = [];

  for (let i = 0; i < count; i++) {
    const country = countries[i % countries.length];
    players.push(
      createPlayerData({
        id: i + 1,
        firstname: 'Player',
        lastname: `${i + 1}`,
        shortname: `P${i + 1}`,
        country: {
          code: country.code,
          picture: 'https://example.com/flag.jpg',
        },
        data: {
          rank: i + 1,
          points: 1000 + i * 100,
          weight: (70 + i * 5) * 1000, // convertir en grammes
          height: 175 + i * 2,
          age: 25 + i,
          last: [1, 0, 1, 1, 0],
        },
      }),
    );
  }

  return players;
};

/**
 * Données invalides pour les tests d'erreur
 */
const invalidPlayerData = {
  missingName: { country: 'France', birthYear: 1990 },
  invalidEmail: { name: 'Test', country: 'France', birthYear: 1990, weight: 'invalid' },
  emptyName: { name: '', country: 'France', birthYear: 1990 },
  futureBirthYear: { name: 'Test', country: 'France', birthYear: 2030 },
};

/**
 * Helper pour attendre un délai (utile pour les tests d'intégration)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper pour extraire les propriétés importantes d'un joueur (pour les assertions)
 */
const extractPlayerProps = (player) => ({
  name: player.name,
  country: player.country,
  birthYear: player.birthYear,
  weight: player.weight,
  height: player.height,
  isLeftHanded: player.isLeftHanded,
});

/**
 * Matcher personnalisé pour Jest - vérifie qu'un objet contient les propriétés d'un joueur
 */
const toMatchPlayerData = (received, expected) => {
  const pass = Object.keys(expected).every((key) => received[key] === expected[key]);

  if (pass) {
    return {
      message: () => 'Expected player not to match data',
      pass: true,
    };
  } else {
    return {
      message: () => 'Expected player to match data',
      pass: false,
    };
  }
};

// Étendre Jest avec notre matcher personnalisé
expect.extend({ toMatchPlayerData });

module.exports = {
  createPlayerData,
  createPlayersData,
  invalidPlayerData,
  delay,
  extractPlayerProps,
  toMatchPlayerData,
};
