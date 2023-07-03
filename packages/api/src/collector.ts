#!/usr/bin/env node

import { parseFeed } from "htmlparser2"

import { initializeDatabaseConnectionPool, runQuery } from "./db"
import http from "./http"

function work() {
	setInterval(async () => {
		const urls = await runQuery<{ url: string }>("SELECT url FROM feeds;")
		process.send(JSON.stringify(urls))

		const out = await http.get(urls.rows[0].url)

		process.send(JSON.stringify(parseFeed(out as string)))
	}, 5000)
}

initializeDatabaseConnectionPool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
})

work()

process.send("Worker started.")
