import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './comp/cartcontext';
import Header from './comp/header.jsx';
import Navbar from './comp/Navbar.jsx';
import Footer from './comp/Footer.jsx';
import Menu from './comp/menu.jsx';
import Events from './comp/events.jsx';

import About from './comp/about';
import Coffee from './comp/coffee.jsx';
import Cake from './comp/cake.jsx';
import Sandwich from './comp/sandwich.jsx';
import ChessPuzzle from './comp/chesspuzzle.jsx';
import SearchResult from './comp/searchresult.jsx';
import ItemDetail from './comp/itemdetail.jsx';
import Login from './comp/login.jsx';
import Resform from './comp/regform.jsx';

import Cart from './comp/cart.jsx'; // Import the Cart component
import EventRegistration from './comp/EventRegistration.jsx'; // Import the EventRegistration component
import Checkout from './comp/Checkout';
import ThankYou from './comp/ThankYou.jsx';
import ViewOrder from './comp/ViewOrder.jsx';


import './index.css';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                   
                                    <Menu />
                                    <Events />
                                   
                                </>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="regform" element={<Resform/>}/>
                        <Route path="/coffee" element={<Coffee />} />
                        <Route path="/cake" element={<Cake />} />
                        <Route path="/sandwich" element={<Sandwich />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/chess-puzzle" element={<ChessPuzzle />} />
                        <Route path="/search" element={<SearchResult />} />
                        <Route path="/item/:id" element={<ItemDetail />} />
                        <Route path="/cart" element={<Cart />} /> {/* Route for Cart */}
                        <Route path="/register" element={<EventRegistration />} /> {/* Route for Event Registration */}
                        
                         <Route path="/checkout" element={<Checkout />} />
                         <Route path="/thankyou" element={<ThankYou />} />
                         <Route path="/vieworder" element={<ViewOrder />} />
                        
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
