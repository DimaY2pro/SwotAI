import React, { useState } from "react";
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

export default function App() {
  const [menteeName, setMenteeName] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [currentSection, setCurrentSection] = useState("intro");
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
  } else if (["strengths", "weaknesses", "opportunities", "threats"].includes(currentSection)) {
    const unanswered = responses[currentSection].some(answer => !answer || answer.trim() === "");
    if (unanswered) {
      alert("Please answer all questions in this section before proceeding.");
      return;
    }
  }

  setCurrentSection(steps[currentIndex + 1]);
};


  const handleBack = () => {
    const steps = ["intro", "strengths", "weaknesses", "opportunities", "threats", "summary"];
    const currentIndex = steps.indexOf(currentSection);
    if (currentIndex > 0) setCurrentSection(steps[currentIndex - 1]);
  };

  // Mock AI Suggestion Function
  const fetchAISuggestions = async (sectionType, goal) => {
    console.log(`Fetching AI suggestions for ${sectionType} related to career goal: ${goal}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock suggestions based on section type
    // In a real app, this would be an API call to a generative AI model
    const mockData = {
      strengths: [
        `Strong analytical skills relevant to ${goal}`,
        `Effective communication for ${goal} presentations`,
        `Proactive learning ability for ${goal} technologies`
      ],
      weaknesses: [
        `Limited experience in specific tools for ${goal}`,
        `Public speaking anxiety in ${goal} contexts`,
        `Delegation skills when leading ${goal} projects`
      ],
      opportunities: [
        `Growing demand for ${goal} professionals`,
        `Networking events for ${goal} experts`,
        `Online courses to upskill in ${goal} areas`
      ],
      threats: [
        `Rapid technological changes in the ${goal} field`,
        `High competition for ${goal} positions`,
        `Economic downturn impacting ${goal} opportunities`
      ]
    };
    return mockData[sectionType] || [`No specific suggestions for ${sectionType} regarding ${goal}. Consider general good practices.`];
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
          prompts={swotPrompts[currentSection]}
          responses={responses[currentSection]}
          onChange={(index, value) => handleChange(currentSection, index, value)}
          onNext={handleNext}
          onBack={handleBack}
          careerGoal={careerGoal}
          fetchAISuggestions={fetchAISuggestions}
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
