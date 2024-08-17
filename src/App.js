import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UPIAmount from "./component/UPIAmount"
import UPIGateway from "./component/UPIGateway"


function App() {
    return (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UPIAmount />}/>
              <Route path="/gate" element={<UPIGateway />} />
            </Routes>
          </BrowserRouter>
        </div>
    );
}

export default App;
