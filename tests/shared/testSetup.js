const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Configuration globale Jest
jest.setTimeout(30000);

let mongod;

// Setup avant tous les tests
beforeAll(async () => {
  // Démarrer MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Se connecter à la base de test
  await mongoose.connect(uri);
});

// Nettoyage après tous les tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

// Nettoyage après chaque test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});