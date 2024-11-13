'use client'

import Head from 'next/head'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import BackgroundLayout from '../ui-background-components/BackgroundLayout';
import useTextColor from '../ui-background-components/useTextColor';

export default function Home() {
    const textColor = useTextColor();
    const [tempSearch, setTempSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [chatBars, setChatBars] = useState(null);
    const [userId,setUserId] = useState('');
    const [allRoles, setAllRoles] = useState([])
    const [confirmClick, setConfirmClick] = useState(0);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    function getAllRoles() {
        fetch(`${apiUrl}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to get all roles');
                }
                console.info("Successfully get all roles.")
                return response.json();
            })
            .then(data => {
                setAllRoles(data);
            })
            .catch(error => console.error('Error:', error));
    }

    // 1. Initialize, obtain and set the userId of the main user
    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const userIdLong = parseInt(storedUserId, 10);
        if (!isNaN(userIdLong)) {
            setUserId(userIdLong);
        }
        getAllRoles();
    }, []);

    //2.Triggered after clicking Confim, check that the searchTerm will be modified only when the input userId exists and the role is parent. From now on, it is guaranteed that each searchTerm has the correct parentId.
    function handleSearch() {
        const parentRole = allRoles.find(role => role.userId.toString() === tempSearch && role.roleType === 'parent');
        if (parentRole) {
            console.info("Found a match for a parent role with userId:", parentRole);
            setSearchTerm(tempSearch);  // If a match is found, set searchTerm
        } else {
            console.info("No match found for the given tempSearch as a parent userId. Input another userId please.");
            setSearchTerm('');
        }
        setConfirmClick(prev => prev + 1);
    }

    useEffect(() => {
        handleSearch();
    }, []);

    // initialization
    useEffect(() => {
        if (searchTerm) {
            getOrAddChatBar();
        }
    }, [searchTerm]);

    useEffect(() => {
        getChatBar();
        if (searchTerm) {
            const searchTermLong = parseInt(searchTerm, 10);
            openChatBar(searchTermLong);
            console.info("searchTerm is ",searchTerm)
        }
    }, [searchTerm, confirmClick]);

    function getOrAddChatBar() {
        fetch(`${apiUrl}/ChatBar/getChatBars/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(bar => bar.userTo.id === parseInt(searchTerm, 10));
                console.info("searchTerm is :",filteredData)
                if (data && data.length > 0 && filteredData.length >0){
                    setChatBars(data);
                    console.info("Successfully get chatBars.", data);
                }
                else {
                    if (searchTerm !== ''){
                        console.info('ChatBar does not exist, creating a new one.');
                        saveChatBar();
                        getOrAddChatBar();
                    }else {
                        console.info('Need a right searchTerm.');
                    }
                }
            })
            .catch(error => console.error('Error updating chat bars with names:', error));
    }

    function saveChatBar() {
        const userIdLong = parseInt(userId, 10);
        const searchTermLong = parseInt(searchTerm, 10);
        fetch(`${apiUrl}/ChatBar/addChatBar?userIdFrom=${userIdLong}&userIdTo=${searchTermLong}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token') },
        })
            .then(response => {
                if (!response.ok) {
                    console.info("Failed to create the chatBar, maybe you put in a wrong userId or a parent's userId.")
                }else {
                    console.info("Successfully create the chatBar")
                }})
            .catch(error => console.error('Error:', error));
    }

    function getChatBar() {
        // First check whether the chat box already exists
        fetch(`${apiUrl}/ChatBar/getChatBars/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch chat bars: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                    if (data && data.length > 0){
                        setChatBars(data)
                        console.info("Successfully get ChatBar: ", data)
                    }else {
                        console.info("Failed to get ChatBar.")
                    }
                }
            )
            .catch(error => console.error('Error updating chat bars with names:', error));
    }

    function closeChatBar(userIdTo) {
        fetch(`${apiUrl}/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
            body: JSON.stringify({ state: 'close' }) // Confirm the specific format required by the API
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update chat bar state');
                }
                console.info("Successfully closed the chatBar.")
                getChatBar();
            })
            .catch(error => console.error('Error:', error));
    }

    function openChatBar(userIdTo) {
        fetch(`${apiUrl}/ChatBar/updateChatBar?userIdFrom=${userId}&userIdTo=${userIdTo}&state=open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + sessionStorage.getItem('token')
            },
            body: JSON.stringify({ state: 'open' }) // Confirm the specific format required by the API
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to open the chat bar.');
                }
                console.info('Successfully open the chatBar.')
                getChatBar();
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <BackgroundLayout>
            <div style={{padding: 20, minHeight: '100vh'}}>
                <Head>
                    <title>Notifications</title>
                    <meta name="description" content="Notification page"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <div style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '12px',
                    color: '#666',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000
                }}>
                </div>
                <h1 className={textColor} style={{fontSize: '24px', margin: '20px 0'}}>Messages</h1>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
                    <input type="text" placeholder="Search notifications..."
                           style={{
                               width: '70%',
                               padding: 10,
                               border: '1px solid #ccc',
                               borderRadius: '8px',
                               boxSizing: 'border-box'
                           }}
                           value={tempSearch}
                           onChange={e => setTempSearch(e.target.value)}/>

                    <button onClick={() => handleSearch()} style={{
                        padding: '10px 20px',
                        marginLeft: '10px',
                        background: '#0070f3',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: 'none'
                    }}>Confirm</button>

                </div>
                <h2 className={textColor}  style={{
                    fontSize: '15px',
                    textAlign: 'center',
                    margin: '20px 0'
                }}>Recently Chat</h2>

                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
                    {chatBars && Array.isArray(chatBars) && chatBars
                        .filter(bar => bar.state !== "close")
                        .map((bar, index) => {
                            const router = useRouter();
                            const handleChatClick = () => {
                                router.push(`/message-chat-walker-final/${parseInt(bar.userTo.id, 10)}`);};
                            return (
                                <div key={index} style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    margin: '10px auto',
                                    minWidth: '300px',
                                    width: '100%',
                                    maxWidth: '600px',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'}}>

                                    <h3 onClick={handleChatClick} style={{
                                        fontSize: '16px',
                                        margin: 0,
                                        padding: '0 10px',
                                        cursor: 'pointer'
                                    }}>
                                        <span style={{ color: 'blue', fontWeight: 'bold' }}>Id: {bar.userTo.id}</span> Chat with user {bar.userTo.name}
                                    </h3>
                                    <button style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} onClick={() => {
                                        closeChatBar(bar.userTo.id);
                                        getOrAddChatBar();
                                    }}>X</button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </BackgroundLayout>
    );
};
