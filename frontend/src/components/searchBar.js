import React, { useState, useEffect } from 'react';

const SearchNotifications = ({ fetchWalkerRequests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            if (searchTerm) {
                setLoading(true);
                const requestURL = `http://127.0.0.1:8080/WalkerRequest/getWalkerRequestByWalkerId/${searchTerm}`;

                fetch(requestURL)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setResults(data); // Assuming the response is the data we want
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        setResults([]); // Clear previous results on error
                        setLoading(false);
                    });
            }
        };

        handleSearch();
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search notifications by parentId..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                results.map(request => (
                    <div key={request.id} style={{ marginTop: '10px' }}>
                        <p>{`Request ID: ${request.id}, Status: ${request.status}`}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchNotifications;
