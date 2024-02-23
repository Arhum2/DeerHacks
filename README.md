<h1>Inspiration</h1>
As UofT students, we understand the demands of rigorous study sessions. StudBot emerged from our desire to address common challenges: overwork, unhappiness, and poor posture.

<h1>What it does</h1>

StudBot is a cutting-edge website designed to optimize study habits through real-time computer vision and machine learning analysis. It monitors students for signs of tiredness, sleepiness, bad posture, and distractions. When these are detected, it sends customizable notifications to encourage taking breaks or refocusing. Additionally, the platform provides detailed analytics of each study session, such as times distracted, focus duration, and posture quality, enabling users to understand and improve their study patterns. An AI-powered chatbot further enhances the experience by offering mental support and study tips. This holistic approach aims to boost academic performance and promote well-being, making Smart Study Buddy an essential tool for students seeking to maximize their study efficiency and health.

<h1>How we built it</h1>
Combining React and Shakra-UI for the frontend and OpenCV with Flask for the backend, StudBot seamlessly analyzes facial data. The Flask server runs OpenCV models, updating the database with facial changes. React communicates with the server, providing real-time notifications on fatigue. GPT-3.5 turbo powers the AI chatbot.

<h1>Challenges we ran into</h1>
Developing accurate backend models for facial feature tracking proved challenging. Perfecting user-friendly interfaces while maintaining robust machine learning model performance also presented significant challenges.

