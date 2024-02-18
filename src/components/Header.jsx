import { Flex, Image, Heading } from "@chakra-ui/react";
import logo from '../assets/studbot.png';

const Header = () => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="flex-start"
            wrap="wrap"
            padding="1rem"
            bg="blue.600"
            color="white"
            width="100%"
        >
            {/* Wrap both the Image and Heading in an anchor tag */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                <Image src={logo} alt="logo" boxSize="80px" marginRight="1rem" />
                <Heading size="lg">StudBot</Heading>
            </a>
        </Flex>
    );
};

export default Header;
