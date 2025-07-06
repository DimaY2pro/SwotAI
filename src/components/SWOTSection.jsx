import React, { useState, useEffect } from "react";

const SWOTSection = ({ section, prompts, responses, onChange, onNext, onBack, careerGoal, fetchAISuggestions, onGoHome }) => {
  const isComplete = responses.every((ans) => ans.trim() !== "");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleFetchSuggestions = async () => {
    if (!careerGoal) {
      alert("Please ensure a career goal is set to get relevant suggestions.");
      return;
    }
    setIsLoadingSuggestions(true);
    setAiSuggestions([]); // Clear previous suggestions
    // try/catch is now within fetchAISuggestions in App.jsx
    const suggestions = await fetchAISuggestions(section, careerGoal, prompts); // Added prompts here
    setAiSuggestions(suggestions);
    // If the first suggestion starts with "Error:" or "Failed", or "OpenAI API key not configured"
    // it's likely an error message we want to highlight or handle differently.
    // For now, they will be displayed as regular suggestions.
    // A more sophisticated approach might involve returning an object { suggestions: [], error: null }
    // or { suggestions: [], error: "message" } from fetchAISuggestions.
    setIsLoadingSuggestions(false);
  };

  useEffect(() => {
    setAiSuggestions([]);
    setIsLoadingSuggestions(false);
  }, [section]);

  const handleResetSection = () => {
    // Clear the textareas for the current section by calling onChange for each prompt
    prompts.forEach((_, index) => {
      onChange(index, "");
    });
    // Clear AI suggestions for the current section
    setAiSuggestions([]);
    setIsLoadingSuggestions(false);
  };

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

      <div className="my-6">
        <button
          onClick={handleFetchSuggestions}
          disabled={isLoadingSuggestions || !careerGoal}
          className="bg-[#FFBA00] text-[#152840] px-4 py-2 rounded hover:bg-[#FFD700] disabled:bg-gray-300"
        >
          {isLoadingSuggestions ? "Loading Suggestions..." : "Get AI Suggestions"}
        </button>
        <button
          onClick={handleResetSection}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Section
        </button>
        {aiSuggestions.length > 0 && (
          <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
            <h4 className="font-semibold text-md mb-2 text-[#183B68]">AI Generated Suggestions:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {aiSuggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {prompts.map((question, index) => (
        <div key={index} className="mb-4">
          <label className="block font-medium mb-1 text-[#152840]">{question}</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={responses[index] || ""}
            onChange={(e) => onChange(index, e.target.value)}
            rows={3}
            required
          />
        </div>
      ))}

      <div className="mt-4 flex justify-between">
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
