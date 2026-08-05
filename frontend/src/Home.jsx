function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to DigitalReads Admin</h1>
            <p>Use the navigation bar above to manage your Digital Library.</p>

            {/* ADDED MARGINS TO PREVENT OVERLAP */}
            <div style={{ fontSize: '100px', margin: '40px 0' }}>
                📖🚀
            </div>

            <p style={{ marginTop: '20px' }}>
                System Status: <span style={{ color: '#28a745', fontWeight: 'bold' }}>● Connected to RSA Resource Server</span>
            </p>
        </div>
    );
}

export default Home;

