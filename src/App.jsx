import React, { useState } from "react";
import OpenAI from "openai";
import SWOTSection from "./components/SWOTSection";
import PDFButton from "./components/PDFButton";

const swotPrompts = {
  strengths: [
    "What technical or soft skills do you excel at? e.g. team leadership, analytical thinking, Excel, public speaking",
    "What achievements or accomplishments are you proud of? e.g. Led university project, internship promotion, won case competition",
    "What personal qualities make you well-suited for your desired career?e.g. Curious, adaptable, problem-solver, driven",
    "What feedback have you received from mentors or peers about your strengths? e.g. Reliable, clear communicator, fast learner, team player",
    "Any other areas you wish to address?"
  ],
  weaknesses: [
    "What skills or knowledge areas do you feel need improvement? e.g. Public speaking, advanced Excel, business writing, coding",
    "What challenges have you encountered in past roles or projects? e.g. Managing deadlines, group conflicts, unclear instructions",
    "Are there any habits or behaviors that may hinder your performance? e.g. Procrastination, overthinking, perfectionism, multitasking",
    "How do you typically respond to feedback or criticism? e.g. Defensive at first, reflective, open to learn, need time to process",
    "Any other areas you wish to address?"
  ],
  opportunities: [
    "What industry trends or developments excite you? e.g. AI in business, green tech, smart cities, digital health",
    "Are there upcoming projects, events, or networking opportunities you can leverage? e.g. Career fair, hackathon, alumni meetup, internship program",
    "What educational resources or mentorship programs are available to you? e.g. Online courses, university workshops, YouthToPro mentorship",
    "How can you align your strengths with emerging opportunities? e.g. Use data skills in sustainability, apply leadership in student orgs",
    "Any other areas you wish to address?"
  ],
  threats: [
    "What external factors could impact your career goals? e.g. Economic downturn, visa restrictions, political instability",
    "Are there changes in the job market or industry you’re concerned about? e.g. Automation, AI replacing jobs, fewer entry-level roles",
    "Do you foresee any personal limitations or obligations affecting your progress? e.g. Family responsibilities, financial constraints, relocation limits",
    "How might competition affect your chances of success? e.g. High number of qualified applicants, limited roles, prestige bias",
    "Any other areas you wish to address?"
  ]
};

const DEFAULT_CAREER_GOAL = "e.g., To build a career in digital marketing with a focus on sustainability-driven brands";

export default function App() {
  const [menteeName, setMenteeName] = useState("");
  const [careerGoal, setCareerGoal] = useState(DEFAULT_CAREER_GOAL);
  const [currentSection, setCurrentSection] = useState("intro");

  // State for AI-generated questions and sample answers
  const [aiSwotStructure, setAiSwotStructure] = useState(null);
  const [isLoadingSwotStructure, setIsLoadingSwotStructure] = useState(false);

  // Initialize responses based on static prompts initially, will be updated
  // after AI generates the new structure.
  const [responses, setResponses] = useState({
    strengths: new Array(swotPrompts.strengths.length).fill(""),
    weaknesses: new Array(swotPrompts.weaknesses.length).fill(""),
    opportunities: new Array(swotPrompts.opportunities.length).fill(""),
    threats: new Array(swotPrompts.threats.length).fill("")
  });


  const handleChange = (section, index, value) => {
    const updatedResponses = { ...responses };
    updatedResponses[section][index] = value;
    setResponses(updatedResponses);
  };

const handleNext = () => {
  const steps = ["intro", "strengths", "weaknesses", "opportunities", "threats", "summary"];
  const currentIndex = steps.indexOf(currentSection);

  if (currentSection === "intro") {
    if (!menteeName || !careerGoal) {
      alert("Please fill out both your name and your career goal.");
      return;
    }
    // === New logic for AI SWOT Structure generation ===
    setIsLoadingSwotStructure(true);
    generateAiSwotStructure(careerGoal).then(structure => {
      setIsLoadingSwotStructure(false);
      if (structure && !structure.error) {
        setAiSwotStructure(structure);
        // Initialize/reset responses state based on the new structure
        const newResponses = {};
        for (const key in structure) {
          if (Array.isArray(structure[key])) {
            newResponses[key] = new Array(structure[key].length).fill("");
          }
        }
        setResponses(newResponses);
        setCurrentSection("strengths"); // Proceed to the first SWOT section
      } else {
        alert(`Could not generate AI SWOT structure: ${structure?.error || "Unknown error"}`);
        // Remain on the intro page, do not clear careerGoal here
        // so the user doesn't have to re-type it if they want to try again.
      }
    });
    return; // Important: Do not fall through to the old setCurrentSection logic
    // === End of new logic ===
  } else if (["strengths", "weaknesses", "opportunities", "threats"].includes(currentSection)) {
    const unanswered = responses[currentSection]?.some(answer => !answer || answer.trim() === "");
    if (unanswered) {
      alert("Please answer all questions in this section before proceeding.");
      return;
    }
  }

  // This part will now only apply for navigation between SWOT sections and to summary
  if (currentIndex < steps.length -1 && currentSection !== "intro") {
    setCurrentSection(steps[currentIndex + 1]);
  } else if (currentSection === "intro" && !isLoadingSwotStructure && aiSwotStructure) {
    // This case should ideally be handled by the async flow above for initial load.
    // If somehow intro is current, and we have structure but not loading, go to strengths.
    // This might be redundant after the async change.
    setCurrentSection("strengths");
  }
};


  const handleBack = () => {
    const steps = ["intro", "strengths", "weaknesses", "opportunities", "threats", "summary"];
    const currentIndex = steps.indexOf(currentSection);
    if (currentIndex > 0) setCurrentSection(steps[currentIndex - 1]);
  };

  const handleGoHome = () => {
    setCurrentSection("intro");
    setMenteeName("");
    setCareerGoal(DEFAULT_CAREER_GOAL); // Reset to default example text
    // Reset to initial static prompts structure for responses, and clear AI structure
    setResponses({
      strengths: new Array(swotPrompts.strengths.length).fill(""),
      weaknesses: new Array(swotPrompts.weaknesses.length).fill(""),
      opportunities: new Array(swotPrompts.opportunities.length).fill(""),
      threats: new Array(swotPrompts.threats.length).fill("")
    });
    setAiSwotStructure(null); // Clear the AI-generated structure
    setIsLoadingSwotStructure(false); // Ensure loading is reset
  };

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const generateAiSwotStructure = async (careerGoal) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error("OpenAI API key not found for SWOT structure generation.");
      // Return an error object or throw an error to be caught by the caller
      return { error: "OpenAI API key not configured." };
    }

    const promptText = `
You are an expert career development coach specializing in personalized SWOT analysis.
Your task is to generate a structured SWOT analysis framework based on the user's provided career goal.

Career Goal: "${careerGoal}"

For EACH of the four SWOT categories (Strengths, Weaknesses, Opportunities, Threats), you must:
1. Generate exactly 5 insightful and distinct questions that will help the user critically assess that category in relation to their stated career goal.
2. For each generated question, provide a concise, illustrative sample answer (1-2 sentences) that is also tailored to the career goal. This sample answer should exemplify the type of reflection expected.

The entire output MUST be a single, valid JSON object. Do not include any text or explanations before or after the JSON object.
The JSON object must have the following structure (showing 3 for brevity, but you must generate 5 for each category):
{
  "strengths": [
    { "question": "Generated question 1 for strengths relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 1 for strengths." },
    { "question": "Generated question 2 for strengths relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 2 for strengths." },
    { "question": "Generated question 3 for strengths relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 3 for strengths." },
    { "question": "Generated question 4 for strengths relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 4 for strengths." },
    { "question": "Generated question 5 for strengths relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 5 for strengths." }
  ],
  "weaknesses": [
    { "question": "Generated question 1 for weaknesses relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 1 for weaknesses." },
    { "question": "Generated question 2 for weaknesses relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 2 for weaknesses." },
    { "question": "Generated question 3 for weaknesses relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 3 for weaknesses." },
    { "question": "Generated question 4 for weaknesses relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 4 for weaknesses." },
    { "question": "Generated question 5 for weaknesses relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 5 for weaknesses." }
  ],
  "opportunities": [
    { "question": "Generated question 1 for opportunities relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 1 for opportunities." },
    { "question": "Generated question 2 for opportunities relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 2 for opportunities." },
    { "question": "Generated question 3 for opportunities relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 3 for opportunities." },
    { "question": "Generated question 4 for opportunities relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 4 for opportunities." },
    { "question": "Generated question 5 for opportunities relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 5 for opportunities." }
  ],
  "threats": [
    { "question": "Generated question 1 for threats relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 1 for threats." },
    { "question": "Generated question 2 for threats relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 2 for threats." },
    { "question": "Generated question 3 for threats relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 3 for threats." },
    { "question": "Generated question 4 for threats relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 4 for threats." },
    { "question": "Generated question 5 for threats relevant to ${careerGoal}?", "sampleAnswer": "Sample answer 5 for threats." }
  ]
}

Ensure the questions are thought-provoking and the sample answers are practical examples.
Replace "{careerGoal}" in your actual output with the user's provided career goal where appropriate in the generated questions and sample answers if it enhances specificity, but prioritize natural language.
    `.replace(/\$\{careerGoal\}/g, careerGoal); // Ensure all placeholders are replaced.

    console.log("Attempting to generate full AI SWOT structure for career goal:", careerGoal);
    // For debugging the exact prompt being sent:
    // console.log("Full prompt for SWOT structure generation:", promptText);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106", // Model that supports JSON mode
        messages: [
          { role: "system", content: "You are an AI assistant that outputs JSON." }, // System message can be simple when JSON mode is on
          { role: "user", content: promptText }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5, // Lower temperature for more predictable, structured output
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        console.log("Successfully received structured SWOT from AI.");
        // The content should already be a stringified JSON object due to response_format.
        // We attempt to parse it.
        try {
          const parsedJson = JSON.parse(content);
          // Basic validation of the structure
          if (parsedJson.strengths && parsedJson.weaknesses && parsedJson.opportunities && parsedJson.threats) {
            return parsedJson;
          } else {
            console.error("AI response is valid JSON but not the expected SWOT structure:", parsedJson);
            return { error: "AI response did not match the expected SWOT structure." };
          }
        } catch (e) {
          console.error("Failed to parse JSON response from AI:", e, "\nRaw content:", content);
          return { error: "Failed to parse AI's response. The response was not valid JSON." };
        }
      } else {
        console.error("No content received from AI for SWOT structure.");
        return { error: "No content received from AI." };
      }
    } catch (error) {
      console.error("Error fetching full AI SWOT structure:", error);
      if (error.response && error.response.status === 401) {
        return { error: "Invalid OpenAI API key or insufficient credits." };
      }
      return { error: "Failed to fetch SWOT structure from AI. Check console for details." };
    }
  };

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const fetchAISuggestions = async (sectionType, goal, sectionPrompts) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error("OpenAI API key not found.");
      return ["OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file."];
    }

    // Just the list of questions, numbered.
    const questionsList = sectionPrompts && sectionPrompts.length > 0
      ? sectionPrompts.map((q, i) => `${i + 1}. ${q}`).join('\n')
      : "No specific guiding questions were provided for this section.";

    const prompt = `
      You are an expert career advisor assisting a user with their SWOT analysis for the career goal: "${goal}".
      The user is currently working on the "${sectionType.toUpperCase()}" section.

      The specific guiding questions for this section are:
      ${questionsList}

      Your task: Generate 3-5 concise, actionable bullet-point suggestions. Each suggestion should directly help the user reflect on or answer one or more of the guiding questions listed above, considering their career goal and the "${sectionType.toUpperCase()}" context.

      For example, if a guiding question is "What are your key skills?", a relevant suggestion might be "- Identify technical skills like Python or Java relevant to ${goal}".

      Please provide ONLY the bullet-point suggestions. Do not include titles, introductions, or any other text.
      Format:
      - Suggestion 1
      - Suggestion 2
      - Suggestion 3
    `;

    console.log(`Fetching AI suggestions for ${sectionType} (refined prompt)...`);
    // console.log("Full prompt to AI:", prompt); // Strongly recommend enabling this for your testing

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert career advisor providing SWOT analysis suggestions." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 150,
        n: 1,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        // Parse the content, assuming suggestions are newline-separated and may start with '-' or '*'
        const suggestions = content
          .split('\n')
          .map(s => s.replace(/^[-*]\s*/, '').trim()) // Remove leading bullet points and trim whitespace
          .filter(s => s.length > 0); // Remove any empty lines
        return suggestions.length > 0 ? suggestions : ["No specific suggestions generated. Try rephrasing your goal."];
      }
      return ["No suggestions received from AI."];
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      if (error.response && error.response.status === 401) {
        return ["Error: Invalid OpenAI API key or insufficient credits."];
      }
      return ["Failed to fetch suggestions from AI. Check console for details."];
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 font-sans">
      {currentSection === "intro" && (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Welcome to Youth To Professionals SWOT Tool</h1>
          <label className="block mb-4">
            <span className="block text-lg font-medium mb-1">Your Name:</span>
            <input
              type="text"
              value={menteeName}
              onChange={(e) => setMenteeName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </label>
          <label className="block mb-4">
            <span className="block text-lg font-medium mb-1">What is your career goal?</span>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </label>
          <button
            onClick={handleNext}
            className="bg-[#183B68] text-white px-4 py-2 rounded mt-4 hover:bg-[#152840]"
          >
            Start SWOT Analysis
          </button>
        </div>
      )}

      {["strengths", "weaknesses", "opportunities", "threats"].includes(currentSection) && (
        <SWOTSection
          section={currentSection}
          promptItems={ // Pass the full items {question, sampleAnswer}
            aiSwotStructure && aiSwotStructure[currentSection]
              ? aiSwotStructure[currentSection]
              : swotPrompts[currentSection].map(q => ({ question: q, sampleAnswer: "" })) // Fallback structure
          }
          responses={responses[currentSection]}
          onChange={(index, value) => handleChange(currentSection, index, value)}
          onNext={handleNext}
          onBack={handleBack}
          careerGoal={careerGoal}
          // fetchAISuggestions={fetchAISuggestions} // To be removed as per user decision
          onGoHome={handleGoHome}
        />
      )}

      {currentSection === "summary" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#152840]">Summary</h2>
          <p className="mb-4"><strong>Name:</strong> {menteeName}</p>
          <p className="mb-6"><strong>Career Goal:</strong> {careerGoal}</p>
          {Object.entries(responses).map(([section, answers]) => (
            <div key={section} className="mb-6">
              <h3 className="text-xl font-semibold capitalize text-[#183B68] mb-2">{section}</h3>
              <ul className="list-disc pl-6 space-y-1">
                {answers.map((answer, idx) => (
                  <li key={idx}>{answer}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-4 flex gap-4">
  <button
    onClick={handleGoHome}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Home
  </button>
  <button
    onClick={handleBack}
    className="px-4 py-2 bg-gray-300 text-[#152840] rounded hover:bg-gray-400"
  >
    Back
  </button>
  <PDFButton
    menteeName={menteeName}
    careerGoal={careerGoal}
    responses={responses}
  />
</div>
        </div>
      )}
    </div>
  );
}
