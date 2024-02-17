import { useState, useRef, useEffect } from 'react'; // Import useEffect here
import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInput from './components/ChatInput';
import ChatDisplay from './components/ChatDisplay';
import io from 'socket.io-client';


const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageHistoryRef = useRef([]);

  useEffect(() => {
    const socket = io('ws://localhost:5000');
  
    socket.on('connect', () => console.log('WebSocket Connected'));
    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });
    socket.on('sleepy_notification', (data) => {
      console.log("Received sleepy_notification", data); // More detailed log
      if (data.sleepy) {
        console.log("User is sleepy."); // Handle sleepy notification
      }
    });
    // socket.on('disconnect', () => console.log('WebSocket Disconnected'));
  
    // Clean up on component unmount
    // return () => {
    //   console.log('Cleaning up socket');
    //   socket.off('sleepy_notification');
    //   socket.disconnect();
    // };
  }, []);

  const talkToChatbot = async (userMessage) => {
    setLoading(true);
    const updatedMessages = [...messageHistoryRef.current, { role: 'user', content: userMessage }];
    messageHistoryRef.current = updatedMessages;
    setMessages(updatedMessages);

    // Use actual values for API key and URL, or ensure your environment variables are set up correctly
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: updatedMessages,
      }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, options);
      const json = await response.json();
      const botMessage = json.choices[0].message.content;

      messageHistoryRef.current = [...messageHistoryRef.current, { role: 'assistant', content: botMessage }];
      setMessages(messageHistoryRef.current);
    } catch (error) {
      console.error('Error talking to chatbot:', error);
    }

    setLoading(false);
  };

  return (
    <Box bg="blue.600" color="white" height="100vh" paddingTop={130}>
      <Container maxW="3xl" centerContent>
        <Header />
        <ChatDisplay messages={messages} />
        <ChatInput talkToChatbot={talkToChatbot} loading={loading} />
        <Footer />
      </Container>
    </Box>
  );
};

export default App;
