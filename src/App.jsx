import { useState, useRef, useEffect } from 'react'; 
// import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInput from './components/ChatInput';
import ChatDisplay from './components/ChatDisplay';
import io from 'socket.io-client';
import ChatButton from './components/ChatButton'; 
import ChatPopup from './components/ChatPopup'; 
import WebcamFeed from './components/WebcamFeed';
import AnalysisSidebar from './components/AnalysisSidebar';
import { Slide } from '@chakra-ui/react';
import { Container, Box, Flex, useDisclosure, useToast } from '@chakra-ui/react';


const App = () => {
    const [messages, setMessages] = useState([]); // store the conversation
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const messageHistoryRef = useRef([]);
    const prevSleepyState = useRef(false); // useRef to keep track of the previous sleepy state
    const toast = useToast();

    const fetchStats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/stats');
            const data = await response.json();
            setAnalysisResults(data); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://127.0.0.1:5000/data', {method:"GET", mode:'cors'})
                .then(response => response.json())
                .then(data => {
                    console.log(data); // 'data' contains 'sleepy' boolean

                    if (data.sleepy && !prevSleepyState.current) {
                        // Play sound
                        const alertSound = new Audio('/ping-82822.mp3'); 
                        alertSound.play();
                        toast({
                            title: "You seem tired.",
                            description: "Get some rest!",
                            status: "warning",
                            duration: 9000,
                            isClosable: true,
                            position: "top",
                        });

                        
                        setIsOpen(true); 

                        // Update the previous sleepy state
                        prevSleepyState.current = data.sleepy;
                    } else if (!data.sleepy) {
                        // Update prev sleepy state when user no longer sleepy
                        prevSleepyState.current = false;
                    }
                })
                .catch(error => console.error('Error fetching from Flask server:', error));
        }, 1000);

        return () => clearInterval(interval); // Clean up interval
    }, []);

    const [analysisResults, setAnalysisResults] = useState({
        timesDistracted: 0,
        distractedDuration: '0 minutes',
        focusDuration: '0 minutes',
        sleepy: false,
        badPosture: true,
        emotion: 'Happy',
        yawn: false,
        count_sleep: 0,
        count_yawn: 0,
        count_total: 0,
    });

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const handleAnalysis = () => {
        setIsSidebarVisible(!isSidebarVisible);
        if (!isSidebarVisible) { // Fetch stats when sidebar becomes visible
            fetchStats();
        }
    };

    // const [chatIsOpen, setChatIsOpen] = useState(false); 
    //
    // const openChat = () => setChatIsOpen(true); 
    // const closeChat = () => setChatIsOpen(false); 
    const { isOpen: chatIsOpen, onOpen: openChat, onClose: closeChat } = useDisclosure();

    const talkToChatbot = async (userMessage) => {
        setLoading(true);

        // Define the system message to instruct the model on desired behavior
        const systemMessage = {
            role: "system",
            content: "You are a helpful and empathetic assistant. Your role is to support and encourage students who are going through a stressful time. Use an informal and friendly tone, and include emojis when appropriate to convey warmth and understanding."
        };

        // Add user's message to convo history for the UI.
        messageHistoryRef.current = [...messageHistoryRef.current, { role: 'user', content: userMessage }];
        setMessages(messageHistoryRef.current);

        // Construct API req body with system message and the convo history.
        const body = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, ...messageHistoryRef.current],
        });

        // API request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: body,
        };

        try {
            // Make the API request
            const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, options);
            const json = await response.json();

            // Check if response contains messages
            if (json.choices && json.choices.length > 0) {
                const botMessage = json.choices[0].message.content;
                messageHistoryRef.current = [...messageHistoryRef.current, { role: 'assistant', content: botMessage }];
                setMessages(messageHistoryRef.current);
            } else {
                // Handle unexpected response structure
                console.error('Unexpected response structure:', json);
            }
        } catch (error) {
            console.error('Error talking to chatbot:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box bg="blue.600" color="white" minH="100vh">
            <Header />
            <Flex>
                <AnalysisSidebar isVisible={isSidebarVisible} results={analysisResults} />

                <Box flex="1" minH="100vh">
                    <Container maxW="3xl" centerContent paddingTop="4rem">
                        <WebcamFeed onAnalyze={handleAnalysis} />
                        <Footer />
                    </Container>
                    <ChatButton onOpen={openChat} />
                    <ChatPopup isOpen={chatIsOpen} onClose={closeChat}>
                        <ChatDisplay messages={messages} />
                        <ChatInput talkToChatbot={talkToChatbot} loading={loading} />
                    </ChatPopup>
                    {/* Other modals or UI elements as needed */}
                </Box>
            </Flex>
        </Box>
    );
};

export default App;
