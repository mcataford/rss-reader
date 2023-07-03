import { Pool } from "pg"

interface QueryResult<T> {
	rows: Array<T>
	rowCount: number | null
}

interface DatabaseConfiguration {
	host: string
	port: number
	database: string
	user: string
	password: string
}

/*
 * Singleton connection pool to the database.
 */
let databaseConnectionPool: Pool | null

/*
 * Either returns or creates then returns the database client singleton.
 */
export function initializeDatabaseConnectionPool(config: DatabaseConfiguration) {
	if (databaseConnectionPool) {
		console.warn("Database connection pool already initialized.")
		return
	}

	try {
		databaseConnectionPool = new Pool(config)
	} catch (e) {
		console.error("Failed to initialize connection pool.")
		throw e
	}
	console.log("Database connection pool ready.")
}

export async function runQuery<RowFormat>(queryText: string): Promise<QueryResult<RowFormat>> {
	if (!databaseConnectionPool) throw Error("Connection pool not initialized, cannot query.")

	const result = await databaseConnectionPool.query(queryText)

	return {
		rows: result.rows,
		rowCount: result.rowCount,
	}
}
