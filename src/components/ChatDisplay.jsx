import { Box, Text, VStack, Divider } from "@chakra-ui/react";

const ChatDisplay = ({ messages }) => {
  return (
    <VStack
      width="100%"
      maxHeight="400px" // or any other value that fits your design
      overflowY="auto"
      padding={4}
      spacing={4}
      align="stretch"
    >
      {messages.map((message, index) => (
        <Box key={index} bg={message.role === 'user' ? 'blue.300' : 'gray.100'} color={message.role === 'user' ? 'white' : 'black'} padding={3} borderRadius="lg" alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}>
          <Text fontSize="md">{message.content}</Text>
          {index < messages.length - 1 && <Divider orientation="horizontal" />}
        </Box>
      ))}
    </VStack>
  );
};

export default ChatDisplay;
