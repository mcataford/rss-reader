const https = require('https')

async function httpGet(url) {
    return new Promise((resolve) => {
        https.get(url, (response) => {
            response.on('data', (d) => resolve(d))
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
