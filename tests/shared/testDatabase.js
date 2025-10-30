const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

class TestDatabase {
  constructor() {
    this.mongod = null;
  }

  async connect() {
    // Créer une instance de MongoDB en mémoire
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();
    
    // Se connecter avec mongoose (réutilise la logique existante)
    await mongoose.connect(uri);
    
    return uri;
  }

  async clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  async closeDatabase() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (this.mongod) {
      await this.mongod.stop();
    }
  }
}

module.exports = TestDatabase;