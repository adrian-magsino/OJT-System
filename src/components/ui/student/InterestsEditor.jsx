'use client'

import { useState } from "react";

export default function InterestsEditor( {initialInterests = [], onSave }) {
  const [interests, setInterests] = useState (initialInterests);
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
    }
  };

  const removeInterest = (indexToRemove) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(interests);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving interests:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setInterests(initialInterests);
    setNewInterest("");
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="mt-4 mx-4">
      <div className="flex flex-wrap gap-2">
        {/* Display interests*/}
        {interests.map((interest_, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full border"
          >
            <span>{interest_}</span>
            {isEditing && (
              <button
                onClick={() => removeInterest(index)} 
                className="ml-1 text-red-600 hover:text-red-800 font-bold text-xl"
                title="Remove interest"
              >
                -
              </button>
            )}
             
          </div>
        ))}

        {/*Add new interest */}
        {isEditing && (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-dashed border-gray-400 rounded-full">
            <input 
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add Interest"
              className="bg-transparent outline-none text-sm min-w-[120px]"
            />
            <button
              onClick={addInterest}
              className="text-green-600 hover:text-green-800 font-bold"
              title="Add interest"
            >
              +
            </button>
            

          </div>
        )}

        {interests.length === 0 && !isEditing && (
          <span className="text-gray-500 italic">No interest added yet.</span>
        )}
      </div>

      <div className="flex justify-center items-center my-2">
        {!isEditing? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-yellow-300 text-gray-700 text-sm rounded hover:bg-yellow-400"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div> 
        )}
      </div>
    </div>
  );
}