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
            top="104px"
            left={isVisible ? 0 : '-300px'}
            width="295px"
            overflow="auto"
            transition="left 0.6s"
            zIndex={10}
        >
            <VStack spacing={5} divider={<Divider borderColor="gray.200" />} align="start">
                <VStack spacing={3} align="start">
                    <Stat>
                        <StatLabel>Distracted Percentage</StatLabel>
                        <StatNumber justifyContent="left">{results.distracted_percentage}</StatNumber>

                    </Stat>
                    <Stat>
                        <StatLabel>Total Time Studying</StatLabel>
                        <StatNumber justifyContent="left">{results.count_total + " minutes"}</StatNumber>

                    </Stat>
                    <Stat>
                        <StatLabel>Focus Percentage</StatLabel>
                        <StatNumber justifyContent="left">{results.focus_percentage}</StatNumber>

                    </Stat>
                </VStack>

                <VStack spacing={3} align="start">
                    <Stat>
                        <StatLabel>Sleepy</StatLabel>
                        <StatNumber justifyContent="left">{results.sleepy ? 'Yes' : 'No'}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Bad Posture</StatLabel>
                        <StatNumber justifyContent="left">{results.badPosture ? 'Yes' : 'No'}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Emotion</StatLabel>
                        <StatNumber justifyContent="left">{results.emotion}</StatNumber>
                    </Stat>
                </VStack>

                {/* <VStack spacing={3} align="start">
                    <Stat>
                        <StatLabel>Count Sleep</StatLabel>
                        <StatNumber justifyContent="left">{results.count_sleep}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Count Yawn</StatLabel>
                        <StatNumber justifyContent="left">{results.count_yawn}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Total Count</StatLabel>
                        <StatNumber justifyContent="left">{results.count_total}</StatNumber>
                    </Stat>
                </VStack> */}
            </VStack>
        </Box>
    );
};

export default AnalysisSidebar;