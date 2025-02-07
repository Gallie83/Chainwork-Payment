import React from "react";
import { useParams } from "react-router-dom";

export default function GigDetails() {
  const { id } = useParams();

  
  const gig = {
    id: id,
    title: "Create a Stunning Logo",
    freelancer: "Rohit Sharma",
    description: "A high-quality logo design tailored to your brand identity.",
    price: "₹2,500",
    rating: 4.8
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:text-white">
      <h1 className="text-3xl font-bold">{gig.title}</h1>
      <p className="text-gray-600">By {gig.freelancer}</p>
      <p className="mt-4">{gig.description}</p>
      <p className="mt-2 text-lg font-semibold">Price: {gig.price}</p>
      <p className="mt-2 text-yellow-500">⭐ {gig.rating}</p>
    </div>
  );
}
