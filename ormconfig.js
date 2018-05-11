module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres',
  entities: [
    "target/entities/*.js"
  ],
  synchronize: true,
  logging: true,
  "migrations": [
     "target/migrations/*.js"
  ],
  "cli": {
     "migrationsDir": "src/migrations"
  }
}
