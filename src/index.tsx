if (process.env.NODE_ENV === 'development') {
    require('preact/debug')
}

import { QueryClient, QueryClientProvider } from 'react-query'
import { render } from 'preact'

import { NavigationProvider } from './hooks/useNavigation'
import App from './App'

const queryClient = new QueryClient()

render(
    <NavigationProvider>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </NavigationProvider>,
    document.getElementById('app'),
)
