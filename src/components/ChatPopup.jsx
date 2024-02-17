// ChatPopup.jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';

const ChatPopup = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Chat with us!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Chat content goes here. If you're using a third-party chat service, their widget code would go here. */}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ChatPopup;
