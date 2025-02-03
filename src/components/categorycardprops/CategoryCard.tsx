import React from 'react';

interface CategoryCardProps {
  imageSrc: string;
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ imageSrc, title }) => {
  return (
    <div className="flex flex-col items-center">
      <img src={imageSrc} alt={title} className="h-64 object-cover w-56" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    </div>
  );
};

export default CategoryCard;
