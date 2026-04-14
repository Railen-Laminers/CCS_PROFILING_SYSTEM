import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { FiPlus, FiX } from 'react-icons/fi';

const SkillCategory = ({ title, skills, onDelete, onProficiencyChange }) => {
    const { isDark } = useTheme();
    
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                    <div key={index} className={`relative p-4 ${isDark ? 'bg-[#181818]' : 'bg-white'} rounded-xl border border-gray-200 dark:border-gray-800`}>
                        <button 
                            onClick={() => onDelete(index)}
                            className="absolute top-3 right-3 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                        <div className="pr-8">
                            <p className="text-gray-800 dark:text-white font-semibold text-lg mb-3">{skill.name}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Proficiency</span>
                                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => onProficiencyChange(index, level)}
                                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                                            skill.proficiency === level
                                                ? 'bg-[#ff6b00] text-white'
                                                : isDark 
                                                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const FacultySkills = () => {
    const { isDark } = useTheme();
    const [skills, setSkills] = useState({
        'Programming Languages': [
            { name: 'Python', proficiency: 'Expert' },
            { name: 'JavaScript', proficiency: 'Advanced' },
            { name: 'Java', proficiency: 'Intermediate' },
            { name: 'C++', proficiency: 'Advanced' },
        ],
        'Research Areas': [
            { name: 'Machine Learning', proficiency: 'Expert' },
            { name: 'Artificial Intelligence', proficiency: 'Expert' },
            { name: 'Data Science', proficiency: 'Advanced' },
            { name: 'Computer Vision', proficiency: 'Advanced' },
        ],
        'Frameworks': [
            { name: 'React', proficiency: 'Advanced' },
            { name: 'TensorFlow', proficiency: 'Expert' },
            { name: 'PyTorch', proficiency: 'Expert' },
            { name: 'Node.js', proficiency: 'Intermediate' },
        ],
        'Teaching Methods': [
            { name: 'Project-Based Learning', proficiency: 'Expert' },
            { name: 'Flipped Classroom', proficiency: 'Advanced' },
            { name: 'Laboratory Experiments', proficiency: 'Expert' },
            { name: 'Online Teaching', proficiency: 'Advanced' },
        ],
    });

    const handleDelete = (category, index) => {
        setSkills(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const handleProficiencyChange = (category, index, level) => {
        setSkills(prev => ({
            ...prev,
            [category]: prev[category].map((skill, i) => 
                i === index ? { ...skill, proficiency: level } : skill
            )
        }));
    };

    const handleAddSkill = () => {
        console.log('Add skill clicked');
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'} p-6 lg:p-8`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                        Skills & Expertise
                    </h1>
                    <button 
                        onClick={handleAddSkill}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b00] hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>+ Add Skill</span>
                    </button>
                </div>

                <div className="space-y-8">
                    <SkillCategory 
                        title="Programming Languages"
                        skills={skills['Programming Languages']}
                        onDelete={(index) => handleDelete('Programming Languages', index)}
                        onProficiencyChange={(index, level) => handleProficiencyChange('Programming Languages', index, level)}
                    />
                    <SkillCategory 
                        title="Research Areas"
                        skills={skills['Research Areas']}
                        onDelete={(index) => handleDelete('Research Areas', index)}
                        onProficiencyChange={(index, level) => handleProficiencyChange('Research Areas', index, level)}
                    />
                    <SkillCategory 
                        title="Frameworks"
                        skills={skills['Frameworks']}
                        onDelete={(index) => handleDelete('Frameworks', index)}
                        onProficiencyChange={(index, level) => handleProficiencyChange('Frameworks', index, level)}
                    />
                    <SkillCategory 
                        title="Teaching Methods"
                        skills={skills['Teaching Methods']}
                        onDelete={(index) => handleDelete('Teaching Methods', index)}
                        onProficiencyChange={(index, level) => handleProficiencyChange('Teaching Methods', index, level)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FacultySkills;