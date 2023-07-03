import https from "node:https"
import { URL } from "node:url"

async function get(url: string) {
	const parsedUrl = new URL(url)
	return new Promise((resolve, reject) =>
		https.get(
			{
				hostname: parsedUrl.hostname,
				port: parsedUrl.port,
				path: parsedUrl.pathname,
			},
			(response) => {
				const chunks = []
				response.on("data", (chunk) => {
					chunks.push(chunk)
				})

				response.on("end", () => {
					resolve(chunks.join(""))
				})
			},
		),
	)
}

export default { get }
