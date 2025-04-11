import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./css/output.css";
import App from './App.jsx';
import { HeroUIProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
<HeroUIProvider>

<Provider store={store}>
  <App/>
</Provider>
<ToastContainer position="top-center" autoClose={3000} />

    </HeroUIProvider> 
     </StrictMode>
)
