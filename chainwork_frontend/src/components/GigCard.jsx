import React from "react";

export default function GigCard({ gig, onClick }) {
  return (
    <div className=" rounded-lg p-4 hover:shadow-lg cursor-pointer border-[1px] border-black dark:border-white" onClick={onClick}>
      <h3 className="text-xl font-bold dark:text-white">{gig.title}</h3>
      <p className="text-gray-600 dark:text-white">By {gig.freelancer}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-semibold dark:text-white">{gig.price}</span>
        <span className="text-yellow-500">⭐ {gig.rating}</span>
      </div>
    </div>
  );
}
