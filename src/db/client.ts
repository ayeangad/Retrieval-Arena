import postgres from "postgres";


const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment missing")
}

export const sql = postgres(connectionString)

