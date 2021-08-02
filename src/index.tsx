if (process.env.NODE_ENV === 'development') {
    require('preact/debug')
}

import { render } from 'preact'

import App from './App'

render(<App />, document.getElementById('app'))
