import React, { useState, useEffect } from "react";

const SWOTSection = ({ section, promptItems, responses, onChange, onNext, onBack, onGoHome }) => {
  const currentResponses = responses || new Array(promptItems.length).fill("");
  const [editedFields, setEditedFields] = useState({});

  // Effect to initialize or reset editedFields when the section, prompts, or responses change.
  useEffect(() => {
    const initialEditedFields = {};
    if (promptItems && responses) {
      promptItems.forEach((item, index) => {
        const currentResponse = responses[index];
        // A field is considered "edited" if:
        // 1. There is a response for it (not empty/whitespace).
        // 2. AND (EITHER the sampleAnswer is empty/whitespace OR the currentResponse is different from a non-empty sampleAnswer)
        // This ensures that if a user simply accepts a pre-filled AI sample, it's not marked "edited"
        // for this local state unless App.jsx's validation already passed it.
        // If the user typed something themselves, it will be marked as edited.
        if (currentResponse && currentResponse.trim() !== "") {
          if (item.sampleAnswer && item.sampleAnswer.trim() !== "") {
            // If there's a sample answer and it's not empty
            if (currentResponse !== item.sampleAnswer) {
              initialEditedFields[index] = true; // User changed it from sample
            }
            // If currentResponse IS THE SAME as a non-empty sampleAnswer, it remains not 'edited' by this local logic.
            // App.jsx handles the initial validation of whether AI samples *must* be changed.
            // This local 'editedFields' helps re-enable 'Next' if user *did* make a valid change.
          } else {
            // No sample answer, or sample answer is empty. Any non-empty response means user typed it.
            initialEditedFields[index] = true;
          }
        }
      });
    }
    setEditedFields(initialEditedFields);
  }, [section, promptItems, responses]);

  const handleInputChange = (index, value) => {
    onChange(index, value);
    setEditedFields(prev => ({ ...prev, [index]: true }));
  };

  const handleResetSection = () => {
    promptItems.forEach((_, index) => {
      onChange(index, "");
    });
    setEditedFields({});
  };

  const isComplete = promptItems.every((item, index) => {
    const response = currentResponses[index];
    const isLastQuestion = index === promptItems.length - 1; // Assuming open-ended is always last

    if (isLastQuestion) {
      return true; // Optional open-ended question does not block "Next"
    }

    // For guided questions:
    // Must have a non-empty response AND be marked as edited.
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
            placeholder={item.sampleAnswer || ""}
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
