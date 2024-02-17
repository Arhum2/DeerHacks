import { Heading, Image, Text } from "@chakra-ui/react"
import logo from '../assets/light-bulb.svg'


const Header = () => {
  return (
    <>
    <Image src={logo} alt = "logo"
    width={100} marginBottom ='1rem' />
        <Heading color="white" marginBottom='1rem'>Study Budy</Heading>
     <Heading /> 
     <Text fontSize={25} textAlign='center'>Need help? Let us know!</Text>
     </>
  )
}

export default Header