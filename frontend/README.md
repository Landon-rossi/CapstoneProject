# Solar Wind AI Project

Welcome to the Solar Wind AI Project, a cutting-edge web application designed to educate users about solar wind and space weather through interactive and informative content. This project leverages artificial intelligence to provide insights and predictions about solar wind events, offering users a comprehensive platform for learning and engagement.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pages and Functionality](#pages-and-functionality)
  - [Home Page](#home-page)
  - [Learn More Page](#learn-more-page)
  - [Try Model Page](#try-model-page)
  - [Mini Game Page](#mini-game-page)
  - [Contact Page](#contact-page)
- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development](#development)
- [Build](#build)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Solar Wind AI Project is designed to provide users with a deep understanding of solar wind phenomena and their effects on Earth. By integrating AI models, the application offers dynamic interactions and predictions, making it a valuable resource for both educational and research purposes.

## Key Features

- **AI-Powered Predictions**: Utilize AI models to predict and classify solar wind events, enhancing space weather research.
- **Interactive Learning**: Engage with educational content and simulations to gain insights into solar wind dynamics.
- **Collaborative Platform**: Connect with the project team and contribute to the advancement of space weather research.

## Pages and Functionality

### Home Page

- **Introduction**: Presents the project's mission and invites users to explore further.
- **Information Section**: Explains how the AI model works, detailing data collection, AI-powered predictions, and space weather applications.
- **Call to Action**: Encourages collaboration by inviting users to contact the team and contribute to the project.

### Learn More Page

- **Educational Hub**: Provides foundational knowledge about solar wind and space weather.
- **Interactive Links**: Directs users to subpages for deeper exploration of specific topics.
- **AI Chat Feature**: Allows users to interact with AI models for detailed insights.

### Try Model Page

- **Model Interaction**: Enables users to select and test different AI models.
- **Graph Execution**: Supports running models with specific parameters and viewing output graphs.
- **History Management**: Maintains a history of completed graphs and their outputs.

### Mini Game Page

- **Interactive Experience**: Offers a game that simulates solar wind events, educating users in a fun way.
- **Wave Progression**: Tracks user progress through waves of solar wind events.

### Contact Page

- **Team Introduction**: Displays profiles of team members and their contributions.
- **Contact Information**: Provides email links for users to reach out to the team.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd frontend
npm install
```

## Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Markdown**: A component for rendering Markdown content.
- **OpenAI**: Integration for AI chat functionality.

## Development

To start the development server, run:

```bash
npm run dev
```

This will start the server on `http://localhost:3000`.

## Build

To build the application for production, run:

```bash
npm run build
```

The output will be in the `.next` directory.

## Environment Variables

Create a `.env` file in the root directory to store environment variables. For example:

```
API_KEY=your_api_key_here
```

## Folder Structure

- **components/**: Contains React components used in the application.
- **public/**: Static assets such as images and fonts.
- **lib/**: Utility functions and libraries.
- **app/**: Main application logic and pages.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
