interface VendorCardProps {
  backgroundImage: string;
  avatar: string;
  name: string;
  craft: string;
}
// Alternative Minimal Design
const VendorCard: React.FC<VendorCardProps> = ({
  backgroundImage,
  avatar,
  name,
  craft,
}) => {
  return (
    <div className="max-w-sm overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-md group rounded-xl hover:shadow-xl">
      {/* Header with Background */}
      <div className="relative h-32 bg-gradient-to-r from-orange-400 to-orange-300">
        <img
          src={backgroundImage}
          alt="Background"
          className="object-cover w-full h-full transition-opacity duration-300 opacity-80 group-hover:opacity-100"
        />
      </div>

      <div className="p-3 text-center">
        {/* Avatar */}
        <div className="relative mb-2 -mt-12">
          <img
            src={avatar}
            alt={name}
            className="object-cover w-20 h-20 mx-auto border-4 border-white rounded-full shadow-lg"
          />
        </div>

        <h3 className="mb-1 text-lg font-bold text-gray-900">{name}</h3>
        <p className="mb-3 text-sm font-medium text-orange-500">{craft}</p>
        {/* Action Button */}
       
        <button className="w-full px-4 py-2 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
          Visit Store
        </button>
   
      </div>
    </div>
  )
}
export default VendorCard;