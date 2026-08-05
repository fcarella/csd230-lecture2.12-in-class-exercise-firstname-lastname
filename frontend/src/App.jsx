import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router' // NEW
import Navbar from './Navbar'
import Home from './Home'
import Book from './Book'
import BookForm from './BookForm'
import './App.css'

function App() {
    const [books, setBooks] = useState([]);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. HANDSHAKE (No change)
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
            } else {
                alert("Login Failed.");
            }
        } catch (err) {
            console.error("Login Error:", err);
        }
    };

    // 2. READ (Authenticated)
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch('/api/rest/books', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    // 3. CRUD HELPERS
    const handleAddBook = (newBook) => setBooks([...books, newBook]);

    const handleDeleteBook = (id) => {
        if (!window.confirm("Delete?")) return;
        fetch(`/api/rest/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (res.ok) setBooks(books.filter(b => b.id !== id));
        });
    };

    const handleUpdateBook = (id, data) => {
        fetch(`/api/rest/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(saved => setBooks(books.map(b => (b.id === id ? saved : b))));
    };

    // --- RENDER LOGIC ---
    if (loading) return <h2>Connecting to DigitalReads RSA Server...</h2>;

    if (!token) {
        return (
            <div className="login-container">
                <h1>DigitalReads Login</h1>
                <form onSubmit={handleLogin}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Get RSA Token</button>
                </form>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <Navbar username={username} onLogout={() => setToken(null)} />

            <Routes>
                {/* 1. HOME ROUTE */}
                <Route path="/" element={<Home />} />

                {/* 2. INVENTORY ROUTE */}
                <Route path="/inventory" element={
                    <div className="book-list" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1>Inventory Management</h1>
                        {books.map((b) => (
                            <Book key={b.id} {...b} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />
                        ))}
                    </div>
                } />

                {/* 3. ADD BOOK ROUTE */}
                <Route path="/add" element={
                    <BookForm token={token} onBookAdded={handleAddBook} />
                } />
            </Routes>
        </div>
    );
}

export default App;

