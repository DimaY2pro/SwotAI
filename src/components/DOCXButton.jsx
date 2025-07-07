import React from "react";
import { generateDocx } from "./DOCXExporter"; // Assuming DOCXExporter.js is in the same directory

const DOCXButton = ({ menteeName, careerGoal, responses }) => {
  const handleDownloadDOCX = () => {
    console.log("DOCXButton: handleDownloadDOCX called.");
    console.log("DOCXButton: menteeName:", menteeName);
    console.log("DOCXButton: careerGoal:", careerGoal);
    console.log("DOCXButton: responses:", JSON.stringify(responses)); // Log stringified responses for better inspection

    // Enhanced check for responses
    const isResponsesPopulated = responses &&
                                 typeof responses === 'object' &&
                                 Object.keys(responses).length > 0 &&
                                 Object.values(responses).some(arr => Array.isArray(arr) && arr.length > 0);

    if (!menteeName || !careerGoal || !isResponsesPopulated) {
      console.error("DOCXButton: Missing required data for DOCX generation. Name, goal, or responses are inadequate.");
      console.error("Mentee Name:", menteeName, "Career Goal:", careerGoal, "Is Responses Populated:", isResponsesPopulated);
      alert("Please ensure all SWOT information (including name, career goal, and at least one response in one section) is complete before downloading.");
      return;
    }
    console.log("DOCXButton: Calling generateDocx...");
    generateDocx(menteeName, careerGoal, responses);
  };

  return (
    <button
      onClick={handleDownloadDOCX}
      className="px-4 py-2 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 transition ease-in-out duration-150"
      title="Download SWOT Analysis as DOCX"
    >
      Download DOCX
    </button>
  );
};

export default DOCXButton;
