// ChatButton.jsx
import { Button } from '@chakra-ui/react';

const ChatButton = ({ onOpen }) => {
    return (
        <Button
            position="fixed"
            bottom="2rem"
            left="2rem"
            colorScheme="teal"
            onClick={onOpen}
        >
            Chat with us!
        </Button>
    );
};

export default ChatButton;
