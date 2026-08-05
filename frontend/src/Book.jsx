import { useState } from 'react';

function Book({ id, title, author, price, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempAuthor, setTempAuthor] = useState(author);
    const [tempPrice, setTempPrice] = useState(price);

    const handleSave = () => {
        const updatedBook = {
            title: tempTitle,
            author: tempAuthor,
            price: parseFloat(tempPrice),
            copies: 10
        };
        onUpdate(id, updatedBook); // Call parent function
        setIsEditing(false);       // Exit edit mode
    };

    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid orange', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fffdf5' }}>
                <input style={{ flex: 2, padding: '5px' }} type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                <input style={{ flex: 1, padding: '5px' }} type="text" value={tempAuthor} onChange={(e) => setTempAuthor(e.target.value)} />
                <input style={{ width: '80px', padding: '5px' }} type="number" step="0.01" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />

                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ cursor: 'pointer' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="book-info">
                <h3>{title}</h3>
                <p><strong>Author:</strong> {author} | <strong>Price:</strong> ${Number(price).toFixed(2)}</p>
            </div>
            <div className="book-actions">
                <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}>Delete</button>
            </div>
        </div>
    );
}

export default Book;

