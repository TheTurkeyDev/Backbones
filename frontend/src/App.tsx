import { GlobalStyles } from './global-styles';
import { ThemeContextProvider, Toast } from 'gobble-lib-react';
import { HashRouter as Router } from 'react-router-dom';
import { Routing } from './router';

function App() {
    return (
        <ThemeContextProvider>
            <GlobalStyles />
            <Toast>
                <Router>
                    <Routing />
                </Router>
            </Toast>
        </ThemeContextProvider>
    );
}

export default App;
