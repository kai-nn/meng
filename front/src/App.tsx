import React, { Suspense } from 'react';
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import InfoPanel from "./components/InfoPanel/InfoPanel";


function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <Main />
            <InfoPanel />
        </Suspense>
    );
}

export default App;
