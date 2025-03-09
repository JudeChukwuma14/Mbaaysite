interface CardProps {
    title: string;
    image: string;
    bgColor?: string;
    para: string;
    link?: string;
  }
  
  export default function CardList({ title, image, bgColor, link, para }: CardProps) {
    const cardStyle = {
      width: "290px",
      height: "350px",
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  
    return (
      <div>
        <div style={cardStyle} className={`relative ${bgColor || ""}`}>
          <div className="absolute top-0 left-0 h-[350px] w-full bg-black inset-0 opacity-60"></div>
          <div className="absolute bottom-2 text-white left-0 p-4">
            <h5>{title}</h5>
            <p className="text-sm">
              {para}
            </p>
            <a href={link} className="text-orange-500 text-sm cursor-pointer">
              Show Now
            </a>
          </div>
        </div>
      </div>
    );
  }
  