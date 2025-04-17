GitHub setup
To set up use:
cd /to/where/you/want/to/store
git clone https://github.com/Landon-rossi/CapstoneProject 

Ensure npm is installed (more info) go to your command line and type the following:
cd /frontend/

npm install

npm run dev

Navigate to http://localhost:3000


Try Model Page Setup

Both scripts will downgrade your python version to 3.10.

Mac User Setup:

First Install HomeBrew and then run the script "mac_package_installer.sh"

Windows User Setup:

First install Chocolatey and then run the script "win_package_installer.bat"

Install Tailwind:

run the below command in frontend/

npx tailwindcss init

npm install fastq


find the file called tailwind.config.js and replace its contents with the below:

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


then restart the server and re run:
npm run dev


