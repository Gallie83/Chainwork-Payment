import React from "react";

export default function FreelancerCard({ freelancer, onClick }) {
  return (
    <div className="border-[1px] border-black dark:border-white rounded-lg p-4 hover:shadow-lg cursor-pointer" onClick={onClick}>
      <h3 className="text-xl font-bold dark:text-white">{freelancer.name}</h3>
      <p className="text-gray-600 dark:text-white">{freelancer.skill}</p>
      <p className="text-gray-500 dark:text-white">{freelancer.location}</p>
      <div className="text-yellow-500 mt-2">⭐ {freelancer.rating}</div>
    </div>
  );
}
