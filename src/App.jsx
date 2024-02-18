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
import { Container, Box, Flex, useDisclosure } from '@chakra-ui/react';


const App = () => {
  const [messages, setMessages] = useState([]); // This will store the conversation
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageHistoryRef = useRef([]);


  // Inside your App component, add the following useEffect hook
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:5000/data', {method:"GET", mode:'cors'}) // Make sure the URL matches your Flask server's endpoint
        .then(response => response.text())
        .then(message => {
          console.log(message); // This will log message from the Flask server
        })
        .catch(error => console.error('Error fetching from Flask server:', error));
    }, 5000); // This sets the interval to 5 seconds

    return () => clearInterval(interval); // This clears the interval when the component unmounts
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
    // For demonstration, toggle visibility without changing results
    // In a real scenario, you might update results here as well
    setIsSidebarVisible(!isSidebarVisible);

    // Optionally, update analysis results here if needed
    // setAnalysisResults(newResults);
  };

  // const [chatIsOpen, setChatIsOpen] = useState(false); // State to control chat popup visibility
  //
  // const openChat = () => setChatIsOpen(true); // Handler to open chat popup
  // const closeChat = () => setChatIsOpen(false); // Handler to close chat popup
  const { isOpen: chatIsOpen, onOpen: openChat, onClose: closeChat } = useDisclosure();

  // const MainContent = () => {
  //   return (
  //       <Container centerContent>
  //         {/* ... other content ... */}
  //         <WebcamFeed />
  //         {/* ... other content ... */}
  //       </Container>
  //   );
  // };

  const talkToChatbot = async (userMessage) => {
    setLoading(true);

    // Define the system message to instruct the model on the desired behavior.
    const systemMessage = {
      role: "system",
      content: "You are a helpful and empathetic assistant. Your role is to support and encourage students who are going through a stressful time. Use an informal and friendly tone, and include emojis when appropriate to convey warmth and understanding."
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