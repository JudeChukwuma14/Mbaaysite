import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface VendorCardProps {
  backgroundImage: string;
  avatar: string;
  name: string;
  profession: string;
  location: string;
}

const VendorCard: React.FC<VendorCardProps> = ({ backgroundImage, avatar, name, profession, location }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="relative">
        <img src={backgroundImage} alt="Background" className="w-full h-32 object-cover" />
        <div className="absolute top-24 left-4 flex items-center">
          <img src={avatar} alt={name} className="w-16 h-16 rounded-full border-4 border-white" />
        </div>
      </div>
      <div className="p-4 pt-12">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{profession}</p>
        <p className="text-gray-500 flex items-center">
          <FaMapMarkerAlt className="text-sm mr-1" />{location}
        </p>
      </div>
    </div>
  );
};

export default VendorCard;
