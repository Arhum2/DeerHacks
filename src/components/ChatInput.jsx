import { useState } from "react";
import { Textarea, Button, useToast } from "@chakra-ui/react";

const ChatInput = ({ talkToChatbot, loading }) => { // destructuring props here
  const [text, setText] = useState('');
  const toast = useToast();

  const submitMessage = () => {
    if (text.trim() === "") {
      toast({
        title: "Message field is empty",
        description: "Please enter a message to send.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
        talkToChatbot(text); // This matches the prop passed in App component
        setText(''); // Clear the input after sending the message
    }
  };

  return (
    <>
      <Textarea
        bg="blue.400"
        color="white"
        padding={4}
        marginTop={6}
        height={100} // Height can be less than for keywords since it's for single messages
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type your message here..."
        _placeholder={{ color: 'white' }}
      />
      <Button
        bg="blue.500"
        color="white"
        marginTop={4}
        width="100%"
        _hover={{ bg: "blue.700" }}
        onClick={submitMessage}
      >
        Send Message
      </Button>
    </>
  );
};

export default ChatInput;
