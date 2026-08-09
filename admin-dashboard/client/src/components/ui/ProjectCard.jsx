import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{project.name}</h3>
        <p className="text-gray-500 text-sm">{project.category}</p>
      </div>
    </div>
  );
};

export default ProjectCard;