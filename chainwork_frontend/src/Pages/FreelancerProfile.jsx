import React from "react";
import { useParams } from "react-router-dom";

export default function FreelancerProfile() {
  const { id } = useParams();

  const freelancer = {
    id: id,
    name: "Rahul Verma",
    skill: "Graphic Designer",
    location: "Mumbai, India",
    rating: 4.9,
    bio: "Experienced designer specializing in logos, branding, and illustrations."
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:text-white">
      <h1 className="text-3xl font-bold">{freelancer.name}</h1>
      <p className="text-gray-600">{freelancer.skill} • {freelancer.location}</p>
      <p className="mt-4">{freelancer.bio}</p>
      <p className="mt-2 text-yellow-500">⭐ {freelancer.rating}</p>
    </div>
  );
}
