import React, { useState, useEffect } from "react";

const SWOTSection = ({ section, promptItems, responses, onChange, onNext, onBack, onGoHome, fetchMoreIdeas }) => {
  const currentResponses = responses || new Array(promptItems.length).fill("");
  const [editedFields, setEditedFields] = useState({});
  const [moreIdeas, setMoreIdeas] = useState({}); // Stores fetched ideas: { index: ['idea1', 'idea2'] }
  const [isLoadingMoreIdeas, setIsLoadingMoreIdeas] = useState({}); // Tracks loading state: { index: true }

  // Effect to reset editedFields, moreIdeas, and isLoadingMoreIdeas when the section or its prompts change
  useEffect(() => {
    setEditedFields({});
    setMoreIdeas({});
    setIsLoadingMoreIdeas({});
  }, [section, promptItems]); // section is the primary trigger for a "new page"

  // The useEffect that previously called onChange to pre-fill responses has been removed.
  // App.jsx now directly initializes `responses` state with sample answers.

  const handleInputChange = (index, value) => {
    onChange(index, value); // Call the original onChange to update App's state
    setEditedFields(prev => ({ ...prev, [index]: true })); // Mark field as edited
  };

  const handleFetchMoreIdeas = async (index) => {
    const currentQuestionItem = promptItems[index];
    const userAnswer = currentResponses[index];

    setIsLoadingMoreIdeas(prev => ({ ...prev, [index]: true }));
    setMoreIdeas(prev => ({ ...prev, [index]: [] })); // Clear previous ideas for this index

    try {
      // Assuming fetchMoreIdeas prop is passed from App.jsx and careerGoal is also available as a prop
      // We need to ensure careerGoal is passed to SWOTSection if it's not already
      // For now, assuming careerGoal is available via props to SWOTSection.
      // If not, App.jsx needs to pass it, or fetchMoreIdeas needs to be partially applied in App.jsx
      // Let's assume `careerGoal` prop is available. It was passed for the old fetchAISuggestions.
      // It is not currently in the props list for SWOTSection in the latest plan, so we need to add it back.
      // For now, I will assume it *will* be passed.

      const result = await fetchMoreIdeas(careerGoal, section, currentQuestionItem.question, userAnswer);

      if (result && result.error) {
        // Display error in the moreIdeas array for simplicity, or handle differently
        setMoreIdeas(prev => ({ ...prev, [index]: [`Error: ${result.error}`] }));
      } else if (result && result.ideas) {
        setMoreIdeas(prev => ({ ...prev, [index]: result.ideas }));
      } else {
        setMoreIdeas(prev => ({ ...prev, [index]: ["No specific ideas generated."] }));
      }
    } catch (error) {
      console.error("Error in handleFetchMoreIdeas:", error);
      setMoreIdeas(prev => ({ ...prev, [index]: ["Failed to fetch ideas."] }));
    } finally {
      setIsLoadingMoreIdeas(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleResetSection = () => {
    promptItems.forEach((_, index) => { // Iterate to get index
      onChange(index, ""); // Clear to empty string, fulfilling Option F
    });
    setEditedFields({}); // Reset edited status for all fields, so placeholders will show
    setMoreIdeas({}); // Clear any fetched "more ideas"
    setIsLoadingMoreIdeas({}); // Reset loading states for "more ideas"
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
          {/* "More Ideas" Button and Display Area */}
          <div className="mt-2 text-right"> {/* Aligns button to the right */}
            <button
              type="button"
              onClick={() => handleFetchMoreIdeas(index)}
              disabled={isLoadingMoreIdeas[index] || !fetchMoreIdeas} // Disable if no function passed
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingMoreIdeas[index] ? "Loading Ideas..." : "More Ideas"}
            </button>
          </div>
          {/* Display area for "more ideas" or errors related to fetching them */}
          { (moreIdeas[index] && moreIdeas[index].length > 0) && (
            <div className="mt-2 mb-2 p-3 border rounded bg-gray-50">
              <h5 className="text-xs font-semibold text-gray-600 mb-1">Additional Ideas:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 italic">
                {moreIdeas[index].map((idea, ideaIdx) => (
                  <li key={ideaIdx}>{idea}</li>
                ))}
              </ul>
            </div>
          )}
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
