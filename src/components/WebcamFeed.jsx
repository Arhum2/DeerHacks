import { useRef, useEffect, useState } from 'react';
import { Box, Flex, Switch, FormControl, FormLabel, Button } from '@chakra-ui/react';

const WebcamFeed = ({ onAnalyze }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true); // Correctly use useState for boolean state

    useEffect(() => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    setStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((error) => {
                    console.error("Error accessing the webcam", error);
                });
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const togglePlayPause = () => {
        if (!stream) return;

        const newState = !isPlaying;
        setIsPlaying(newState);
        stream.getTracks().forEach(track => track.enabled = newState);
    };

    return (
        <Flex direction="column" align="center" mt="4">
            <Box boxShadow="xl" p="4" bg="gray.700" borderRadius="lg">
                <video
                    ref={videoRef}
                    width="640"
                    height="480"
                    autoPlay
                    playsInline
                    muted // Optional: Consider adding muted to avoid echo
                    style={{ borderRadius: 'lg' }}
                />
            </Box>
            <FormControl display="flex" alignItems="center" mt="4">
                <FormLabel htmlFor="webcam-switch" mb="0">
                    Webcam {isPlaying ? 'On' : 'Off'}
                </FormLabel>
                <Switch id="webcam-switch" colorScheme="teal" isChecked={isPlaying} onChange={togglePlayPause} />
            </FormControl>
            {/* Analysis Button */}
            <Button colorScheme="teal" mt="4" onClick={onAnalyze}>
                Analysis
            </Button>
        </Flex>
    );
};

export default WebcamFeed;
