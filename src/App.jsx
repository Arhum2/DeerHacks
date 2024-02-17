import { useState } from 'react';
import { Container, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Textinput from './components/Textinput';
import KeywordsModal from './components/KeywordsModal';

const App = () => {

  const [keywords, setKeywords] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const extractKeywords = async (text) => {
    setLoading(true);
    setIsOpen(true);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt:
          'Extract keywords from this text. Each keyword should have the number of occurrences in this format `keyword:occurrences`. Make the first letter of every word uppercase and separate with commas:\n\n' +
          text +
          '',
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.8,
        presence_penalty: 0.0,
      }),
    };

  const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, options);
  
  const json = await response.json();
  
  const data = json.choices[0].text.trim();

  console.log(data);
  setKeywords(data);
  setLoading(false);

  
  };

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <Box bg="blue.600" color="white" height="100vh" 
    paddingTop={130}>

      <Container maxW="3xl" centerContent>
      <Header />
      <Footer />
      <Textinput extractKeywords={extractKeywords}/>
      </Container>
      <KeywordsModal keywords={keywords} loading={loading} isOpen={isOpen} closeModal={closeModal}/>
    
    </Box>
  );
};

export default App