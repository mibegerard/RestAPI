const samplePlayers = [
  {
    name: 'Rafael Nadal',
    country: 'ESP',
    birthYear: 1986,
    weight: 85,
    height: 185,
    isLeftHanded: true,
    picture: 'https://example.com/nadal.jpg'
  },
  {
    name: 'Roger Federer',
    country: 'SUI',  
    birthYear: 1981,
    weight: 85,
    height: 185,
    isLeftHanded: false,
    picture: 'https://example.com/federer.jpg'
  },
  {
    name: 'Novak Djokovic',
    country: 'SRB',
    birthYear: 1987,
    weight: 80,
    height: 188,
    isLeftHanded: false,
    picture: 'https://example.com/djokovic.jpg'
  }
];

const invalidPlayers = [
  {
    // Nom manquant
    country: 'France',
    birthYear: 1990,
    weight: 75,
    height: 180
  },
  {
    name: 'Test Player',
    // Pays manquant
    birthYear: 1990,
    weight: 75,
    height: 180
  },
  {
    name: 'Test Player',
    country: 'France',
    // Année de naissance invalide
    birthYear: 2030,
    weight: 75,
    height: 180
  }
];

const partialUpdateData = {
  firstname: 'Updated',
  lastname: 'Partially'
};

module.exports = {
  samplePlayers,
  invalidPlayers,
  partialUpdateData
};