import { Pool } from "pg"

let db = new Pool({
    connectionString: "postgresql://root:5b2feb10-dcd6-486a-8a0e-de8e8673b2da@37.59.106.141:5434/db"
})

if (db) {
    console.log("Database connection established successfully.")

    const createTableQuery = `        CREATE TABLE IF NOT EXISTS test (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        )
    `

    const insertDataQuery = `        INSERT INTO test (name) VALUES ('test')
    `

    db.query(createTableQuery)
        .then(() => {
            console.log("Table created successfully")
            return db.query(insertDataQuery)
        })
        .then(() => {
            console.log("Successfully created test")
        })
        .catch((err) => {
            console.error("Database error:", err.message)
        })
        .finally(() => {
            db.end()
        })

} else {
    console.log("Error connecting to pool")
}