export default function CareerInput({ value, onChange }) {
  return (
    <div className="mb-6">
      <label htmlFor="career" className="block font-medium mb-2">
        🎯 Enter your Career Goal
      </label>
      <input
        id="career"
        type="text"
        placeholder="e.g. Become a Management Consultant"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

