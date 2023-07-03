import { URL } from "node:url"

import { type Request, type Response } from "express"

import { runQuery } from "./db"

interface CreateFeedPayload {
	url: string
}

/*
 * Creates a new feed record.
 */
export async function createFeed(req: Request, res: Response) {
	const requestBody: CreateFeedPayload = req.body

	let feedUrl
	let hostname
	try {
		const resourceUrl = new URL(requestBody.url)
		feedUrl = resourceUrl.toString()
		hostname = resourceUrl.hostname
	} catch (e) {
		res.status(400).send()
	}

	const result = await runQuery(
		`INSERT INTO feeds (url, host) VALUES ('${feedUrl}', '${hostname}') ON CONFLICT DO NOTHING;`,
	)

	const statusCode = result.rowCount === 0 ? 204 : 201
	res.status(statusCode).json({
		hostname: feedUrl.hostname,
		url: feedUrl.toString(),
	})
}

export async function getFeedItems(req: Request, res: Response) {
	console.log(await runQuery("SELECT * FROM feeds_resources"))
	res.send("ok")
}
