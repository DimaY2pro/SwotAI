import React, { useState, useEffect } from "react";

const SWOTSection = ({ section, promptItems, responses, onChange, onNext, onBack, onGoHome }) => {
  const currentResponses = responses || new Array(promptItems.length).fill("");
  const [editedFields, setEditedFields] = useState({});

  // Effect to reset editedFields when the section or its prompts change
  useEffect(() => {
    setEditedFields({});
  }, [section, promptItems]);

  // The useEffect that previously called onChange to pre-fill responses has been removed.
  // App.jsx now directly initializes `responses` state with sample answers.

  const handleInputChange = (index, value) => {
    onChange(index, value); // Call the original onChange to update App's state
    setEditedFields(prev => ({ ...prev, [index]: true })); // Mark field as edited
  };

  const handleResetSection = () => {
    promptItems.forEach((_, index) => { // Iterate to get index
      onChange(index, ""); // Clear to empty string, fulfilling Option F
    });
    setEditedFields({}); // Reset edited status for all fields, so placeholders will show
  };

  const isComplete = promptItems.every((item, index) => {
    const response = currentResponses[index];
    // A field is considered complete if:
    // 1. It has a non-empty response.
    // 2. It has been marked as edited by the user.
    return response && response.trim() !== "" && editedFields[index] === true;
  });


  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#183B68]">
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </h2>
        <button
          onClick={onGoHome}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Home
        </button>
      </div>

      <div className="my-6 flex justify-end">
        <button
          onClick={handleResetSection}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Section
        </button>
      </div>

      {promptItems.map((item, index) => (
        <div key={index} className="mb-6">
          <label className="block font-medium mb-1 text-[#152840]">{item.question}</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900" // Standard text color
            placeholder={item.sampleAnswer || ""} // Use sampleAnswer as placeholder
            value={currentResponses[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            rows={3}
            required
          />
        </div>
      ))}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-[#152840] rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`px-4 py-2 rounded text-white ${
            isComplete ? "bg-[#347969] hover:bg-[#183B68]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SWOTSection;
