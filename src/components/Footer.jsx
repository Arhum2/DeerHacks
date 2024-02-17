import { Box, Image, Text, Flex } from "@chakra-ui/react"
import logo from '../assets/openai.png' 

const Footer = () => {
  return (
    <Box marginTop={50}>
        <Flex justifyContent='center' alignItems='center'>
            <Image src={logo} marginRight={1} />
            <Text>Powered by OpenAI</Text>
        </Flex>
        </Box>
  )
}

// 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  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

export default Footer