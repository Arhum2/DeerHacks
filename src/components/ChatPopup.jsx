// ChatPopup.jsx
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';

const ChatPopup = ({ isOpen, onClose, children }) => {
    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Chat with us!</DrawerHeader>
                <DrawerBody>
                    {children}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default ChatPopup;
