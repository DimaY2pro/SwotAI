# AI SWOT Career Builder (Vite + React)

This project is a web application designed to help users reflect on their Strengths, Weaknesses, Opportunities, and Threats (SWOT) in a structured flow, with AI-powered suggestions to enhance their career planning. It's built using React with Vite.

## Features

- Step-by-step SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
- Mandatory questions for each section.
- AI-generated suggestions for each SWOT category based on your career goal (powered by OpenAI).
- Summary view of all inputs.
- PDF export of the SWOT analysis summary, including branding.

## Setup and Running the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up OpenAI API Key:**
    This project uses the OpenAI API to generate SWOT suggestions. You will need an OpenAI API key.

    *   Create a file named `.env` in the root of the project (alongside `package.json`).
    *   Add your OpenAI API key to the `.env` file like this:
        ```env
        VITE_OPENAI_API_KEY=your-openai-api-key-goes-here
        ```
    *   Replace `your-openai-api-key-goes-here` with your actual key.
    *   The `.gitignore` file is already configured to ignore `.env` files, so your key will not be committed to git.

    **IMPORTANT SECURITY NOTICE:**
    Using your OpenAI API key directly in the frontend (client-side) is a security risk for production applications, as it can be exposed to users. This setup is intended for development and personal use. For a production environment, you should implement a backend proxy to handle API requests to OpenAI securely.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:5173`.

## How to Use

1.  Open the application in your browser.
2.  Enter your name and your primary career goal.
3.  Proceed through each SWOT section (Strengths, Weaknesses, Opportunities, Threats).
    *   Answer the guiding questions in the text areas.
    *   Click "Get AI Suggestions" to receive AI-powered ideas based on your career goal for that specific section.
4.  Review your inputs on the Summary page.
5.  Click "Download PDF" to get a PDF copy of your SWOT analysis.