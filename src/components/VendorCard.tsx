import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";


interface VendorCardProps {
  backgroundImage: string;
  avatar: string;
  name: string;
  profession: string;
  location: string;
}

const VendorCard: React.FC<VendorCardProps> = ({
  backgroundImage,
  avatar,
  name,
  profession,
  location,
}) => {
  return (
    <div className="max-w-sm overflow-hidden bg-white rounded shadow-lg">
  
        <div className="relative">
          <img
            src={backgroundImage}
            alt="Background"
            className="object-cover w-full h-32"
          />
          <div className="absolute flex items-center top-24 left-4">
            <img
              src={avatar}
              alt={name}
              className="object-cover w-20 h-20 border-4 border-white rounded-full"
            />
          </div>
        </div>
        <div className="p-4 pt-12">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">{profession}</p>
          <p className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-1 text-sm" />
            {location}
          </p>
        </div>
    </div>
  );
};

export default VendorCard;
