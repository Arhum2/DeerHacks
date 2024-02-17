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
            size="lg" // Set the size to 'lg' for larger size or you can use custom padding
            p="1.5rem" // Custom padding for even larger size
            fontSize="1.2rem" // Increase the font size if needed
        >
            Chat with us!
        </Button>
    );
};

export default ChatButton;
