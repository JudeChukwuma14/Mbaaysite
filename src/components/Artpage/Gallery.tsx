import React, { useState } from 'react';


const Gallery: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const images = [
    { id: 1, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 1' },
    { id: 2, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 2' },
    { id: 3, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 3' },
    { id: 4, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 4' },
    { id: 5, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 5' },
    { id: 6, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 6' },
    { id: 7, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 7' },
    { id: 8, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 8' },
    
    { id: 9, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 7' },
    { id: 10, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 8' },
    
    { id: 11, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric_58702-1821.jpg?t=st=1737723284~exp=1737726884~hmac=a335d29a3541a6e898f15a8f970313cdff145467479d84dda39eebbd7bd43f48&w=360', alt: 'Image 7' },
    { id: 12, src: 'https://img.freepik.com/free-photo/colorful-knitted-fabric-art-background_58702-1803.jpg?t=st=1737723398~exp=1737726998~hmac=03d54a1900f12e9e060618be0b487311e426160dba9005817dde48c67c73daae&w=996', alt: 'Image 8' },
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-red-700`}> {/* Dark mode classes */}
      <header className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Art Gallery</h1>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden border border-gray-300 rounded dark:border-gray-700">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto"
            />
          </div>
        ))}
      </main>

      <footer className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800">
        <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
          Previous
        </button>
        <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500">
          Next
        </button>
      </footer>
    </div>
  );
};

export default Gallery;

