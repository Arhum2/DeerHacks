import { useState, useRef } from 'react';
import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInput from './components/ChatInput'; // Rename your Textinput to ChatInput
import ChatDisplay from './components/ChatDisplay.jsx'; // This is a new component to display the chat

const App = () => {
  const [messages, setMessages] = useState([]); // This will store the conversation
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageHistoryRef = useRef([]); // Using a ref to keep track of message history

  const talkToChatbot = async (userMessage) => {
    setLoading(true);

    // Add the user's message to the conversation history
    const updatedMessages = [...messageHistoryRef.current, { role: 'user', content: userMessage }];
    messageHistoryRef.current = updatedMessages;
    setMessages(updatedMessages);

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

      // Add the GPT-3's response to the conversation history
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
        <ChatDisplay messages={messages} /> {/* This component displays the chat messages */}
        <ChatInput talkToChatbot={talkToChatbot} loading={loading} />
        <Footer />
      </Container>
      {/* Other modals or UI elements as needed */}
    </Box>
  );
};

export default App;
