if (process.env.NODE_ENV === 'development') {
    require('preact/debug')
}

import { QueryClient, QueryClientProvider } from 'react-query'
import { render } from 'preact'

import App from './App'

const queryClient = new QueryClient()

render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById('app'),
)
