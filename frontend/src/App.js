import { useEffect } from 'react';
import './App.css';
import Header from "./component/layout/Header/Header.js";
import webFont from "webfontloader";
import Footer from './component/layout/Footer/Footer.js';
import Home from  "./component/Home/Home.js";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
]);

function App() {
  useEffect(()=> {
    webFont.load({
      google: {
        families: ["Roboto","Droid Sans","Chilanka"],
      }
    });
  },[]);
  return (
    <>
    <BrowserRouter>
    <Header/>
    </BrowserRouter>
    <RouterProvider router={router} />
    <Footer/>
    </>
  );
}

export default App;
