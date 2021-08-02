const https = require('https')

async function httpGet(url) {
    return new Promise((resolve) => {
        https.get(url, (response) => {
            const chunks = []
            response.on('data', (d) => chunks.push(d))
            response.on('end', () => resolve(chunks.join('')))
        })
    })
}

const handler = async (event) => {
    try {
        const url = event.queryStringParameters.url
        const proxiedResponse = await httpGet(url)
        return {
            statusCode: 200,
            body: String(proxiedResponse),
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
