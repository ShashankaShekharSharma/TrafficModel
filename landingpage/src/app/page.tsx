'use client';
import { useState } from "react";
import Navbar from "@/app/contents/navbar";

const models = [
  {
    id: 1,
    name: "Model A",
    image: "/path-to-image-a.jpg",
    description: "This is Model A, which excels in NLP tasks.",
    link: "https://example.com/model-a"
  },
  {
    id: 2,
    name: "Model B",
    image: "/path-to-image-b.jpg",
    description: "Model B is designed for image processing.",
    link: "https://example.com/model-b"
  },
  {
    id: 3,
    name: "Model C",
    image: "/path-to-image-c.jpg",
    description: "Model C is optimized for AI-driven automation.",
    link: "https://example.com/model-c"
  },
  {
    id: 4,
    name: "Model D",
    image: "/path-to-image-d.jpg",
    description: "Model D specializes in real-time data analysis.",
    link: "https://example.com/model-d"
  }
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <div id='home' className="grid grid-rows-[100px_1fr_auto] min-h-screen p-4 sm:p-8 lg:p-20 font-[family-name:var(--font-geist-sans)] justify-items-center">
      {/* Navbar Section */}
      <div className="w-full max-w-7xl">
        <Navbar />
      </div>
      {/* Main Content Section */}
      <main className="flex flex-col mt-16 items-center w-full max-w-9xl mb-24 text-center px-4 lg:px-0">
        <div className="w-full">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-8 text-black">Who are we?</h1>
          <div className="bg-gray-100 border border-gray-300 p-8 rounded-2xl shadow-md w-full h-[50vh] flex items-center justify-center bg-opacity-35 backdrop-blur-sm">
            <div className="bg-gray-100 border border-gray-300 p-8 rounded-2xl shadow-md w-full h-[43vh] flex items-center justify-center">
              <p className="text-gray-600 text-sm lg:text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore explicabo corporis, eligendi voluptatum, sequi cumque pariatur commodi omnis a praesentium quia eum perferendis quidem error? Cum tenetur ratione deserunt praesentium?
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Additional Section with Space */}
      <div id="models" className="flex flex-col items-center w-full max-w-9xl mt-32 text-center px-4 lg:px-0">
        <div className="w-full">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-8">Explore our wide range of AI models:</h1>
          <div className="bg-gray-100 border border-gray-300 p-6 lg:p-10 rounded-2xl shadow-inner w-full h-[70vh] flex items-center justify-center bg-opacity-35 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center gap-6 lg:gap-0">
              {/* Sidebar with buttons */}
              <div className="flex lg:flex-col gap-4 lg:mr-8">
                {models.map((model) => (
                  <button
                    key={model.id}
                    className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-gray-400 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors ${
                      selectedModel.id === model.id ? 'border-orange-500 border-2' : ''
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    {model.id}
                  </button>
                ))}
              </div>
             
              {/* Display area */}
              <div className="bg-black border-2 border-orange-500 text-white p-8 rounded-2xl shadow-md w-full h-full flex flex-col items-center justify-center">
                <img 
                  src={selectedModel.image} 
                  alt={selectedModel.name} 
                  className="w-24 lg:w-40 h-24 lg:h-40 object-cover rounded-xl mb-4" 
                />
                <h2 className="text-xl lg:text-2xl font-bold">{selectedModel.name}</h2>
                <p className=" text-center my-4 text-sm lg:text-base">{selectedModel.description}</p>
                <a 
                    href={selectedModel.link} 
                    className="text-white bg-orange-500 p-4 pt-3 justify-center text-center rounded-md hover:bg-white hover:text-black transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}