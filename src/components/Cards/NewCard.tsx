
export default function NewCard() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2  gap-3 justify-center items-center">
        {/* Large Main Card */}
        <div className="relative  h-[410px] bg-cover bg-center" style={{ backgroundImage: `url()` }}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute bottom-2 text-white left-0 p-4">
            <h5>Home</h5>
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            <a href="#" className="text-orange-500 text-sm cursor-pointer">
              Show Now
            </a>
          </div>
        </div>
  
        {/* Two Smaller Cards */}
        <div className="flex flex-col gap-2">
          {[1, 2].map((_, i) => (
            <div key={i} className="relative h-[200px] bg-cover bg-center" style={{ backgroundImage: `url("")` }}>
              <div className="absolute inset-0 bg-black opacity-60"></div>
              <div className="absolute bottom-2 text-white left-0 p-4">
                <h5>Home</h5>
                <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
                <a href="#" className="text-orange-500 text-sm cursor-pointer">
                  Show Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  