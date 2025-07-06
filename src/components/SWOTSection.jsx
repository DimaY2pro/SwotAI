import React, { useEffect } from "react"; // Removed useState for aiSuggestions if not used

const SWOTSection = ({ section, promptItems, responses, onChange, onNext, onBack, onGoHome }) => {
  // Ensure responses array matches the number of promptItems, defaulting to empty strings
  // This check is more of a safeguard; App.jsx should ideally ensure `responses` is correctly sized.
  const currentResponses = responses || new Array(promptItems.length).fill("");
  const isComplete = promptItems.every((_, index) => currentResponses[index] && currentResponses[index].trim() !== "");

  // Removed aiSuggestions and isLoadingSuggestions state and related useEffect & handleFetchSuggestions
  // as the "Get AI Suggestions" button is being removed for now.

  const handleResetSection = () => {
    // Clear the textareas for the current section by calling onChange for each prompt
    promptItems.forEach((_, index) => {
      onChange(index, "");
    });
    // No local AI suggestions to clear anymore if the button is removed
  };

  // Effect to pre-fill responses with sampleAnswers when promptItems change (e.g. initial load with AI data for a section)
  useEffect(() => {
    if (promptItems && promptItems.length > 0) {
      // Check if the responses are currently empty or not matching the sample answers.
      // This prevents overwriting user's edits if they navigate away and back to a section
      // without the section prop itself changing (which would trigger the App.jsx response reset).
      // However, our current App.jsx logic for handleNext/handleBack re-initializes responses for the section.
      // So, this effect will primarily run when a section's promptItems are first loaded.
      promptItems.forEach((item, index) => {
        // We only pre-fill if the current response is empty.
        // If responses are already populated (e.g., user typed something, then navigated away and back),
        // we might not want to overwrite.
        // For now, the decision was to pre-fill. If `responses` are reset to "" in App.jsx on section change, this is fine.
        // The `onChange` prop updates the state in App.jsx.
        if (responses && (responses[index] === "" || responses[index] === undefined) && item.sampleAnswer) {
          onChange(index, item.sampleAnswer);
        } else if (!responses && item.sampleAnswer) { // Handles case where responses prop might be initially undefined for the section
           onChange(index, item.sampleAnswer);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptItems, section]); // onChange is a function, can cause re-renders if not memoized.
  // For now, assuming App.jsx manages responses state reset correctly on section change.
  // If onChange prop from App.jsx is stable (e.g., wrapped in useCallback), it can be added.
  // Given current structure, section change in App.jsx should re-initialize `responses` for that section,
  // making this pre-fill logic safe.


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
        {/* Container for buttons, only Reset Section for now */}
        {/* "Get AI Suggestions" button removed */}
        <button
          onClick={handleResetSection}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Section
        </button>
      </div>

      {promptItems.map((item, index) => (
        <div key={index} className="mb-6"> {/* Increased bottom margin for spacing */}
          <label className="block font-medium mb-1 text-[#152840]">{item.question}</label>
          {/* Sample Answer display will be handled in the next step - either pre-filling this textarea or showing separately */}
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={currentResponses[index] || ""}
            onChange={(e) => onChange(index, e.target.value)}
            rows={3} // Default rows
            required
          />
        </div>
      ))}

      <div className="mt-8 flex justify-between"> {/* Increased top margin for spacing */}
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
