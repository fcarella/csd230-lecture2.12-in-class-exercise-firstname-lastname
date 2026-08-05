import { useState } from 'react';

function BookForm({ token, onBookAdded }) {
    // 1. State for each input field
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0.0);

    // 2. The Submit Handler
    const handleSubmit = (e) => {
        e.preventDefault(); // Stop the page from refreshing

        const newBook = {
            title,
            author,
            price: parseFloat(price),
            copies: 10 // Defaulting inventory for now
        };

        // 3. POST to Spring Boot with the RSA Token
        fetch('/api/rest/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // THE CRITICAL S26 LINE
            },
            body: JSON.stringify(newBook),
        })
            .then(response => {
                if(!response.ok) throw new Error("Could not save book. Check roles.");
                return response.json();
            })
            .then(savedBook => {
                alert("Book Saved to Database!");
                onBookAdded(savedBook); // Call the parent to update the list
                // 4. Clear the form UI
                setTitle(''); setAuthor(''); setPrice(0.0);
            })
            .catch(err => alert(err.message));
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px' }}>
            <h3>Add New Book (Secured)</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <button type="submit">Save to RSA Backend</button>
        </form>
    );
}

export default BookForm;

