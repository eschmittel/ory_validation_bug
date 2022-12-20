import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@ory/elements"

import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Registration} from "./Registration";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider themeOverrides={{}}>
                <Routes>
                    <Route path="/signup" element={<Registration />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
