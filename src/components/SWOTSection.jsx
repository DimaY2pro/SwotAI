import React from "react";

const SWOTSection = ({ section, prompts, responses, onChange, onNext, onBack }) => {
  const isComplete = responses.every((ans) => ans.trim() !== "");

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#183B68] mb-6">
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </h2>

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
