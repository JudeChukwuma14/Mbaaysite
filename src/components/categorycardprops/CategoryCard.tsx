import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  imageSrc: string;
  title: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ imageSrc, title, link }) => {
  return (
    <Link to={link} className="block">
      <div className="flex flex-col items-center">
        <img src={imageSrc} alt={title} className="h-64 object-cover w-56" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;