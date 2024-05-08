// ChatButton.jsx
import { Button } from '@chakra-ui/react';

const ChatButton = ({ onOpen }) => {
    return (
        <Button
            position="fixed"
            bottom="1rem"
            right="1rem"
            colorScheme="teal"
            onClick={onOpen}
            size="lg" // use lg for now, can also use custom padding
            p="1.5rem" 
            fontSize="1.2rem" 
        >
            Chat with us!
        </Button>
    );
};

export default ChatButton;
