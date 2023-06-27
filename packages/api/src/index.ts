import {
    type Express,
    type Request,
    type Response,
    default as express,
} from 'express'

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
    res.send('ok')
})

app.listen(8081, () => {})
