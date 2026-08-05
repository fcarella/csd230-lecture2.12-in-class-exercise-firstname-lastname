import { useState } from 'react';
// 1. IMPORT our centralized Network Robot
import api from './api/axiosConfig';

function BookForm({ onBookAdded }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0.0);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare data to match the Java BookEntity wrappers (Double/Integer)
        const newBook = {
            title,
            author,
            price: parseFloat(price),
            copies: 10
        };

        // 2. USE the api instance.
        // Notice: No manual headers or 'token' props needed!
        // The Axios Interceptor automatically attaches the RSA Passport.
        api.post('/rest/books', newBook)
            .then(response => {
                alert("Book Saved to RSA-Secured Database!");
                onBookAdded(response.data); // Axios returns data in the .data property

                // Clear the UI fields
                setTitle(''); setAuthor(''); setPrice(0.0);
            })
            .catch(err => {
                console.error("Save Error:", err);
                alert("Unauthorized: You do not have permission to add books.");
            });
    };

    return (
        <div style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Add New Book (Secured via Axios)</h3>

            <form onSubmit={handleSubmit}>
                {/* Flexbox Column Headers */}
                <div style={{ display: 'flex', gap: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
                    <div style={{ flex: 2 }}>Title</div>
                    <div style={{ flex: 1 }}>Author</div>
                    <div style={{ width: '100px' }}>Price</div>
                    <div style={{ width: '150px' }}>Action</div>
                </div>

                {/* Input Row */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ flex: 2, padding: '8px' }}
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        style={{ flex: 1, padding: '8px' }}
                    />
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{ width: '100px', padding: '8px' }}
                    />
                    <button type="submit" style={{ width: '150px', padding: '8px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        Save to Backend
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BookForm;

