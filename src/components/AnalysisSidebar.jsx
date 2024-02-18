import React from 'react';
import { Box, VStack, Divider, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

const AnalysisSidebar = ({ isVisible, results }) => {
    return (
        <Box
            p={5}
            color="white"
            bg="gray.700"
            rounded="md"
            shadow="md"
            position="fixed"
            top="64px"
            left={isVisible ? 0 : '-300px'}
            width="300px"
            overflow="auto"
            transition="left 0.2s"
            zIndex={10}
        >
            <VStack spacing={5} divider={<Divider borderColor="gray.200" />}>
                <VStack spacing={3}>
                    <Stat>
                        <StatLabel>Times Distracted</StatLabel>
                        <StatNumber>{results.timesDistracted}</StatNumber>
                        <StatLabel>Occurrences</StatLabel>
                    </Stat>
                    <Stat>
                        <StatLabel>Distracted Duration</StatLabel>
                        <StatNumber>{results.distractedDuration}</StatNumber>
                        <StatLabel>Total Time</StatLabel>
                    </Stat>
                    <Stat>
                        <StatLabel>Focus Duration</StatLabel>
                        <StatNumber>{results.focusDuration}</StatNumber>
                        <StatLabel>Total Time</StatLabel>
                    </Stat>
                </VStack>

                <VStack spacing={3}>
                    <Stat>
                        <StatLabel>Sleepy</StatLabel>
                        <StatNumber>{results.sleepy ? 'Yes' : 'No'}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Bad Posture</StatLabel>
                        <StatNumber>{results.badPosture ? 'Yes' : 'No'}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Emotion</StatLabel>
                        <StatNumber>{results.emotion}</StatNumber>
                    </Stat>
                </VStack>

                <VStack spacing={3}>
                    <Stat>
                        <StatLabel>Yawn Detected</StatLabel>
                        <StatNumber>{results.yawn ? 'Yes' : 'No'}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Count Sleep</StatLabel>
                        <StatNumber>{results.count_sleep}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Count Yawn</StatLabel>
                        <StatNumber>{results.count_yawn}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Count</StatLabel>
                        <StatNumber>{results.count_total}</StatNumber>
                    </Stat>
                </VStack>
            </VStack>
        </Box>
    );
};

export default AnalysisSidebar;
