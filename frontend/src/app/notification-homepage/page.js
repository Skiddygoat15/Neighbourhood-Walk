import Head from 'next/head'

export default function Home() {
    // 假设的用户数据
    const users = ['Emma', 'Ava', 'Sophia', 'Amelia'];
    const messages = [
        { name: 'Abigail', text: 'Accept', time: '23 min' },
        { name: 'Elizabeth', text: 'Ok, see you then.', time: '27 min' },
        { name: 'Penelope', text: 'You: Hey! What\'s up, long time.', time: '33 min' },
        { name: 'Chloe', text: 'You: Hello how are you?', time: '50 min' }
    ];

    return (
        <div style={{ padding: 20, backgroundColor: '#fff', minHeight: '100vh' }}>
            <Head>
                <title>Notifications</title>
                <meta name="description" content="Notification page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '12px', color: '#666', position: 'sticky', top: 0, zIndex: 1000 }}>9:41</div>
            <h1 style={{ color: '#333', fontSize: '24px', margin: '20px 0' }}>Notifications</h1>
            <div style={{ margin: '10px 20px' }}>
                <input type="text" placeholder="Search notifications..." style={{ width: 'calc(100% - 20px)', padding: 10, border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>
            <h2>Recently Chat</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {users.map(user => (
                    <div key={user} style={{ textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#ccc', marginBottom: '5px' }}></div>
                        {user}
                    </div>
                ))}
            </div>
            <h2>Messages</h2>
            <div style={{ marginTop: '20px' }}>
                {messages.map(msg => (
                    <div key={msg.name} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#ccc', marginRight: '10px' }}></div>
                        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{msg.name}</span>
                            <span>{msg.text}</span>
                            <span>{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', position: 'fixed', bottom: 0, width: '100%', padding: '10px 0', backgroundColor: '#f8f8f8', borderTop: '1px solid #ccc' }}>
                <div style={{ textAlign: 'center' }}>Home</div>
                <div style={{ textAlign: 'center' }}>Search</div>
                <div style={{ textAlign: 'center' }}>Messages</div>
                <div style={{ textAlign: 'center' }}>Request</div>
                <div style={{ textAlign: 'center' }}>Profile</div>
            </div>
        </div>
    );
};