import React from "react";
import { generateDocx } from "./DOCXExporter"; // Assuming DOCXExporter.js is in the same directory

const DOCXButton = ({ menteeName, careerGoal, responses }) => {
  const handleDownloadDOCX = () => {
    if (!menteeName || !careerGoal || !responses) {
      alert("Please ensure all SWOT information is complete before downloading.");
      return;
    }
    generateDocx(menteeName, careerGoal, responses);
  };

  return (
    <button
      onClick={handleDownloadDOCX}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" // Example styling
      title="Download SWOT Analysis as DOCX"
    >
      Download DOCX
    </button>
  );
};

export default DOCXButton;
