# AI SWOT Career Builder (Vite + React)

This project is a web application designed to help users reflect on their Strengths, Weaknesses, Opportunities, and Threats (SWOT) in a structured flow, with AI-powered questions to enhance their career planning. It's built using React with Vite.

## Features

- Step-by-step SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
- Guided questions for each SWOT category, with an additional optional open-ended question to add further points.
- AI-generated questions tailored to your career goal for each SWOT category (powered by OpenAI).
- Summary view of all inputs.
- Export your SWOT analysis summary as a PDF or DOCX file, including branding and standardized filenames (`DLV04 SWOT Name_Date.ext`).
- Displays YouthToPro logo on the introduction page.

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
    This project uses the OpenAI API to generate SWOT questions. You will need an OpenAI API key.

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

1.  Open the application in your browser. You'll be greeted by the YouthToPro logo on the intro page.
2.  Enter your name and your primary career goal.
3.  Proceed through each SWOT section (Strengths, Weaknesses, Opportunities, Threats).
    *   Answer the AI-generated (or fallback) guiding questions in the text areas.
    *   Utilize the final open-ended question in each section to add any other points you wish to include (this question is optional to proceed).
4.  Review your inputs on the Summary page.
5.  Click "Download PDF" or "Download DOCX" to get a copy of your SWOT analysis. Files will be named using the convention `DLV04 SWOT YourName_YYYY-MM-DD.ext`.