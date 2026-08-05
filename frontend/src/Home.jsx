import { useLocation } from 'react-router';

function Home() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isExpired = queryParams.get("expired");

    const warningStyle = {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffeeba',
        marginBottom: '30px',
        fontWeight: 'bold',
        display: 'inline-block'
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>DigitalReads Admin</h1>

            {/* Show warning only if the Interceptor added the 'expired' flag */}
            {isExpired && (
                <div style={warningStyle}>
                    ⚠️ Security Alert: Your session has expired. Please log in again.
                </div>
            )}

            <div style={{ fontSize: "100px", margin: "40px 0" }}>📖🚀</div>
            <p>Status: ● Connected to RSA Resource Server</p>
        </div>
    );
}
export default Home;
