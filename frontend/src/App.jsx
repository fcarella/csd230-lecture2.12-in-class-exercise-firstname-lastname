import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { useAuth } from './provider/AuthProvider';
import api from './api/axiosConfig';


// Reusable UI Components
import Navbar from './Navbar';
import Home from './Home';
import Book from './Book';
import BookForm from './BookForm';
import { ProtectedRoute } from './routes/ProtectedRoute';


import './App.css';


function App() {
    // 1. AUTHENTICATION CONTEXT
    // Snatch token, admin status, and the login/logout functions from our Global Provider
    const { token, setToken, isAdmin, logout } = useAuth();


    // 2. LOCAL STATE
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);


    // Login form state (used if no token exists)
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');


    // 3. THE HANDSHAKE (Login)
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Call the RSA Handshake endpoint on our S26 server
            const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });


            if (response.ok) {
                const data = await response.json();
                setToken(data.token); // Store in Global Context
                alert("Handshake Successful! Token received.");
            } else {
                alert("Login Failed. Check credentials in Spring Boot.");
            }
        } catch (err) {
            console.error("Handshake Network Error:", err);
        }
    };


    // 4. READ DATA (Authenticated via Axios Interceptor)
    useEffect(() => {
        // If no passport (token), we aren't fetching data yet
        if (!token) {
            setLoading(false);
            return;
        }


        setLoading(true);
        // Note: No 'Authorization' header needed here!
        // Our 'api/axiosConfig.js' interceptor adds it automatically.
        api.get('/rest/books')
            .then(res => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching books:", err);
                setLoading(false);
            });


    }, [token]); // Re-run whenever the token state changes (Login/Logout)


    // 5. CRUD HELPER FUNCTIONS
    const handleAddBook = (newBook) => {
        setBooks([...books, newBook]);
    };


    const handleDeleteBook = (id) => {
        if (!window.confirm("Delete this book?")) return;


        api.delete(`/rest/books/${id}`)
            .then(() => {
                setBooks(books.filter(b => b.id !== id));
            })
            .catch(err => alert("Unauthorized: Only Admins can delete."));
    };


    const handleUpdateBook = (id, updatedData) => {
        api.put(`/rest/books/${id}`, updatedData)
            .then(res => {
                setBooks(books.map(b => (b.id === id ? res.data : b)));
            })
            .catch(err => alert("Update failed. Check your permissions."));
    };


    // 6. CONDITIONAL RENDER LOGIC


    // UI A: Loading Spinner
    if (loading) {
        return <div className="app-container"><h2>Connecting to RSA Server...</h2></div>;
    }


    // UI B: Login Page (Shown if the user has no token)
    if (!token) {
        return (
            <div className="login-container" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>DigitalReads Login (S26 RSA)</h1>
                <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Username:</label><br/>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Password:</label><br/>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px' }}>Get RSA Token</button>
                </form>
            </div>
        );
    }


    // UI C: Authenticated Switchboard (The "Real" App)
    return (
        <div className="app-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>


            {/* The Navbar stays visible regardless of the sub-page */}
            <Navbar username={username} onLogout={logout} />


            <Routes>
                {/* PUBLIC-ISH ROUTE */}
                <Route path="/" element={<Home />} />


                {/* PROTECTED ROUTES (Locked by RSA Gatekeeper) */}
                <Route element={<ProtectedRoute />}>


                    {/* Inventory View */}
                    <Route path="/inventory" element={
                        <div className="book-list">
                            <h1>Inventory Management</h1>
                            <p>Current Role: <strong>{isAdmin ? "Administrator" : "User"}</strong></p>


                            {books.length === 0 ? (
                                <p>No books found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {books.map((b) => (
                                        <Book
                                            key={b.id}
                                            {...b}
                                            onDelete={handleDeleteBook}
                                            onUpdate={handleUpdateBook}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    } />


                    {/* Add Book View (Locked by RBAC logic in Navbar) */}
                    <Route path="/add" element={
                        <div>
                            <h1>Add to Digital Library</h1>
                            <BookForm onBookAdded={handleAddBook} />
                        </div>
                    } />


                </Route>
            </Routes>
        </div>
    );
}


export default App;
