if (process.env.NODE_ENV === 'development') {
    require('preact/debug')
}

import { render } from 'preact'
import { QueryClient, QueryClientProvider } from 'react-query'

import App from './App'
import { NavigationProvider } from './hooks/useNavigation'

const queryClient = new QueryClient()

render(
    <NavigationProvider>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </NavigationProvider>,
    document.getElementById('app'),
)
