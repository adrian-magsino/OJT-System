'use client'

import { useState, useEffect } from "react";
import { getWorkTaskCategories } from "@/lib/services/work-task-service";

export default function SpecializationEditor({ initialSpecializations = [], onSave }) {
  const [selectedSpecializations, setSelectedSpecializations] = useState(initialSpecializations);
  const [availableWorkTasks, setAvailableWorkTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkTasks();
  }, []);

  const fetchWorkTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { work_tasks, error } = await getWorkTaskCategories();
      
      if (error) {
        throw new Error('Failed to load specializations');
      }
      
      setAvailableWorkTasks(work_tasks || []);
    } catch (error) {
      console.error('Error fetching work_tasks:', error);
      setError('Failed to load specialization options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecializationToggle = (workTaskName) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(workTaskName)) {
        return prev.filter(name => name !== workTaskName);
      } else {
        return [...prev, workTaskName];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedSpecializations);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving specializations:", error);
      setError("Failed to save specializations");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedSpecializations(initialSpecializations);
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="mt-4 mx-4">
        <div className="flex justify-center items-center py-4">
          <div className="text-gray-500">Loading specializations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 mx-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isEditing ? (
        // Display mode
        <div className="flex flex-wrap gap-2">
          {selectedSpecializations.length > 0 ? (
            selectedSpecializations.map((spec, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full border"
              >
                <span>{spec}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500 italic">No specializations selected yet.</span>
          )}
        </div>
      ) : (
        // Edit mode with checkboxes
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            Select your specializations:
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
            {availableWorkTasks.map(category => (
              <label 
                key={category.category_id}
                className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSpecializations.includes(category.category_name)}
                  onChange={() => handleSpecializationToggle(category.category_name)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {category.category_name}
                  </div>
                  {category.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {category.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center my-2">
        {!isEditing ? (
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