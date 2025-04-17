# Frontend Project

This is a frontend project built with Next.js, React, and Tailwind CSS. It includes AI chat functionality using OpenAI and other integrations.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development](#development)
- [Build](#build)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

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
