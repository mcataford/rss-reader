import { default as childProcess } from "child_process"

import { type Express, default as express } from "express"

import { initializeDatabaseConnectionPool } from "./db"
import { createFeed, getFeedItems } from "./handlers"

/*
 * Starts the collector child process and handles messages
 * being exchanged with it.
 */
function startCollector() {
	const collector = childProcess.fork("./dist/collector.js")

	collector.on("message", (data) => {
		console.log(data.toString())
	})
}

try {
	/*
	 * Initializes the singleton database connection pool
	 * that the application uses to talk with the database.
	 */
	initializeDatabaseConnectionPool({
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	})

	const app: Express = express()

	app.use(express.json())

	app.get("/", getFeedItems)
	app.post("/feeds/", createFeed)

	startCollector()

	const applicationPort = process.env.API_PORT
	app.listen(applicationPort, () => {
		console.log(`Listening on ${applicationPort}`)
	})
} catch (e) {
	console.error("Failed to start.")
	throw e
}
