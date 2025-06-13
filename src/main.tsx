import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheets/index.css'
import App from './App.tsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/bench-mark-web/">
      <Routes>  
        <Route path="*" element = {<App/>}/>
      </Routes>    
    </BrowserRouter>
  </StrictMode>
);
