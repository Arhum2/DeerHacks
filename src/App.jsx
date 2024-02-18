import { useState, useRef, useEffect } from 'react'; // Import useEffect here
// import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInput from './components/ChatInput';
import ChatDisplay from './components/ChatDisplay';
import io from 'socket.io-client';
import ChatButton from './components/ChatButton'; // Import your ChatButton component
import ChatPopup from './components/ChatPopup'; // Import your ChatPopup component
import WebcamFeed from './components/WebcamFeed';
import AnalysisSidebar from './components/AnalysisSidebar';
import { Slide } from '@chakra-ui/react';
import { Container, Box, Flex, useDisclosure, useToast  } from '@chakra-ui/react';


const App = () => {
  const [messages, setMessages] = useState([]); // This will store the conversation
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageHistoryRef = useRef([]);

  const [isSleepy, setIsSleepy] = useState(false);
  const [prevIsSleepy, setPrevIsSleepy] = useState(false); // Previous sleepiness status
    const toast = useToast(); // Initialize the useToast hook


    const fetchStats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/stats', { method: 'GET', mode: 'cors' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAnalysisResults(data); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };


  // Inside your App component, add the following useEffect hook

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://127.0.0.1:5000/data', { method: "GET", mode: 'cors' })
                .then(response => response.json())
                .then(data => {
                    console.log("New data fetched:", data);

                    // Calculate "sleepy" based on "count_sleep" and "count_yawn" conditions
                    const isSleepy = data.count_sleep > 1 && data.count_yawn > 2;

                    // Update state with the new data and calculated "sleepy" status
                    setAnalysisResults(prevResults => ({
                        ...prevResults,
                        ...data,
                        sleepy: isSleepy, // Update "sleepy" based on the calculated condition
                    }));
                })
                .catch(error => console.error('Error fetching from Flask server:', error));
        }, 5000); // Adjust the polling interval as needed

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        // Check if sleepiness status changed from false to true
        if (isSleepy && !prevIsSleepy) {
            const alertSound = new Audio('ping-82822.mp3'); // Replace with the actual path to your audio file
            alertSound.play();

            toast({
                title: "You seem tired.",
                description: "Get some rest!",
                status: "warning",
                duration: 15000,
                isClosable: true,
                position: "top",
            });

        }
        setPrevIsSleepy(isSleepy); // Update the previous sleepiness status for the next comparison
    }, [isSleepy, prevIsSleepy]);



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
        if (!isSidebarVisible) { // Fetch stats when the sidebar becomes visible
            fetchStats();
        }
    };

  // const [chatIsOpen, setChatIsOpen] = useState(false); // State to control chat popup visibility
  //
  // const openChat = () => setChatIsOpen(true); // Handler to open chat popup
  // const closeChat = () => setChatIsOpen(false); // Handler to close chat popup
  const { isOpen: chatIsOpen, onOpen: openChat, onClose: closeChat } = useDisclosure();

  const talkToChatbot = async (userMessage) => {
    setLoading(true);

    // Define the system message to instruct the model on the desired behavior.
    const systemMessage = {
      role: "system",
      content: "You are a helpful and empathetic assistant. Your role is to support and encourage students who are going through a stressful time. Use an informal and friendly tone, and include emojis when appropriate to convey warmth and understanding. In your " +
          "response, create a new line after each main point."
    };

    // Add the user's message to the conversation history for the UI.
    messageHistoryRef.current = [...messageHistoryRef.current, { role: 'user', content: userMessage }];
    setMessages(messageHistoryRef.current);

    // Construct the API request body with the system message and the conversation history.
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

        // Check if the response contains messages
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