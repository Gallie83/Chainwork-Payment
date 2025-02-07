import React, { useState } from "react";
import { Search } from "lucide-react";
import GigCard from "../components/GigCard";
import FreelancerCard from "../components/FreelancerCard";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


  const gigs = [
    { id: 1, title: "Create a Stunning Logo", price: "₹2,500", freelancer: "Rohit Sharma", rating: 4.8 },
    { id: 2, title: "Build a Responsive Website", price: "₹10,000", freelancer: "Ayesha Khan", rating: 5.0 },
    { id: 3, title: "Social Media Marketing (Instagram, LinkedIn)", price: "₹5,000", freelancer: "Suresh Iyer", rating: 4.7 }
  ];


  const freelancers = [
    { id: 101, name: "Rahul Verma", skill: "Graphic Designer", location: "Mumbai, India", rating: 4.9 },
    { id: 102, name: "Meera Gupta", skill: "Web Developer", location: "Bangalore, India", rating: 5.0 },
    { id: 103, name: "Vikram Patel", skill: "SEO Specialist", location: "Delhi, India", rating: 4.8 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Find Freelancers & Gigs</h1>

      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search services or freelancers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white border-[1px] border-black dark:border-white"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

     
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Featured Gigs</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} onClick={() => navigate(`/gig/${gig.id}`)} />
        ))}
      </div>

      
      <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">Top Freelancers</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {freelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} freelancer={freelancer} onClick={() => navigate(`/freelancer/${freelancer.id}`)} />
        ))}
      </div>
    </div>
  );
}
