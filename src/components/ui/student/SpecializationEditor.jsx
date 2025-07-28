'use client'

import { useState } from "react";

export default function SpecializationEditor({ initialSpecializations = [], onSave }) {
  const [specializations, setSpecializations] = useState(initialSpecializations);
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (indexToRemove) => {
    setSpecializations(specializations.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(specializations);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving specializations:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSpecializations(initialSpecializations);
    setNewSpecialization("");
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialization();
    }
  };

  return (
    <div className="mt-4 mx-4">
      <div className="flex flex-wrap gap-2">
        {/* Display specializations*/}
        {specializations.map((spec, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full border"
          >
            <span>{spec}</span>
            {isEditing && (
              <button
                onClick={() => removeSpecialization(index)} 
                className="ml-1 text-red-600 hover:text-red-800 font-bold"
                title="Remove specialization"
              >
                x
              </button>
            )}
             
          </div>
        ))}

        {/*Add new specialization */}
        {isEditing && (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-dashed border-gray-400 rounded-full">
            <input 
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add Specialization"
              className="bg-transparent outline-none text-sm min-w-[120px]"
            />
            <button
              onClick={addSpecialization}
              className="text-green-600 hover:text-green-800 font-bold"
              title="Add specialization"
            >
              +
            </button>
            

          </div>
        )}

        {/* Show empty state when no specializations and not editing */}
        {specializations.length === 0 && !isEditing && (
          <span className="text-gray-500 italic">No specializations added yet.</span>
        )}
      </div>

      <div className="flex justify-center items-center my-2">
        {!isEditing? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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