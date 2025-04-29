import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/Login/Login.jsx'

import Home from './components/Home/Home.jsx';
import Menucrd from './components/Menucrd/Menucrd.jsx';
import Menu from './components/Menu/Menu.jsx';
import Fcat from './components/Fcat/Fcat.jsx';
import Fqty from './components/Fqty/Fqty.jsx';
import Privateroute from "./components/Privateroute/Privateroute.jsx";
import Orders from './components/Food_Request/Orders.jsx';
import Cottages from './components/Cottages/Cottages.jsx';


export default function App(){
    return(
        <>
        <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login />} />  
        <Route element={<Privateroute />}>
        <Route path="/home" element={<Home/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/menucrd" element={<Menucrd/>} /> 
        <Route path="/cottages" element={<Cottages/>} />
        <Route path="/menu" element={<Menu/>} />    
        <Route path="/fcat" element={<Fcat/>} />   
        <Route path="/fqty" element={<Fqty/>} /> 
        </Route>      
      </Routes>
    </BrowserRouter>
        </>
    )
}