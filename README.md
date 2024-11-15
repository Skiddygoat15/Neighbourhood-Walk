# Neighbourhood Walk Platform

The **Neighbourhood Walk Platform** is a community-driven solution designed to assist busy parents in ensuring their children have safe and reliable transportation to school. With the rising cost of living necessitating dual-income households, traditional childcare solutions like babysitters or school care programs can often be too expensive or limited in availability. Our platform bridges this gap by connecting parents with trustworthy community members who are willing to help, enabling parents to post and search for school walk requests, establish walk agreements, and foster closer neighborhood connections.

This platform not only helps parents balance work and family responsibilities but also cultivates a sense of community, where members can support one another and positively contribute to each other's lives.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Technology Stack](#technology-stack)


---

## Features
- **User Registration and Profile Management**: Secure user registration and customizable profiles.
- **Identity and Address Verification**: Ensure the trustworthiness of users through verification processes.
- **Walk Request Management**: Publish, update, cancel, accept, or reject walk requests.
- **Search**: Efficiently search for walk requests or walkers within the community.
- **AI Matching and Recommendations**: Intelligent matching of parents and walkers based on preferences and location.
- **End User Notifications**: Real-time notifications for request acceptance/rejection, updates, and pre-meet arrangements.
- **End User Messaging and Chat**: Built-in messaging feature to facilitate communication between parents and walkers.
- **Live Walk Tracking**: Monitor walks in real-time for enhanced security and peace of mind.
- **User Ratings**: Enable parents and walkers to review and rate their experience.
- **End User Dashboards**: Tailored dashboards for parents and walkers to manage activities and monitor status.
- **Admin Dashboard and UI**: Tools for administrators to manage users, requests, and overall platform operations.

---

## Installation

### Backend Setup
First, open a terminal and navigate to the Neighbourhood-Walk folder using cd. \
Then, run npm install to install the necessary packages. \
Start the backend by entering either mvn clean spring-boot:run or .\mvnw clean spring-boot:run.

### Frontend Setup:

Open another terminal and navigate to Neighbourhood-Walk/frontend using cd. \
Run npm install to install the required packages. Start the frontend by entering npm run dev. \
Once you see the message "Ready in 3.2s," the frontend is ready to be accessed in the browser.

## Technology Stack
- Frontend: Next.js, React.js
- Backend: Spring Boot, Java
- Database: MySQL
- Messaging: RabbitMQ
- Containerization: Docker, Docker Compose
- Cloud Services: AWS EC2, S3
- Web Server: Nginx