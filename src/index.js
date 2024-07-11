import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {DataProvider} from './DataContext'
// import { Server } from 'socket.io';
// import eiows from 'eiows'

if (process.env.NODE_ENV === 'production') {
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <DataProvider>
    <App />
  </DataProvider>
  </BrowserRouter> 
);
