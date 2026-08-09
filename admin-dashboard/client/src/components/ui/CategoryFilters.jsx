import React from 'react';

const CategoryFilters = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="flex flex-wrap justify-center mb-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 mx-2 rounded-md ${
          selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        Show All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-4 py-2 mx-2 rounded-md ${
            selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;