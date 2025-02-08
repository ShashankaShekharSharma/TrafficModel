'use client';
import { useState } from "react";
import Navbar from "@/app/contents/navbar";
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const models = [
  { id: 1, name: "Model A", image: "/path-to-image-a.jpg", description: "This is Model A, which excels in NLP tasks.", link: "https://example.com/model-a", video: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=yZwd6lsB5q1Gr5pL" },
  { id: 2, name: "Model B", image: "/path-to-image-b.jpg", description: "Model B is designed for image processing.", link: "https://example.com/model-b", video: "https://www.youtube.com/embed/VIDEO_ID_B" },
  { id: 3, name: "Model C", image: "/path-to-image-c.jpg", description: "Model C is optimized for AI-driven automation.", link: "https://example.com/model-c", video: "https://www.youtube.com/embed/VIDEO_ID_C" },
  { id: 4, name: "Model D", image: "/path-to-image-d.jpg", description: "Model D specializes in real-time data analysis.", link: "https://example.com/model-d", video: "https://www.youtube.com/embed/VIDEO_ID_D" }
];

const developers = [
  { id: 1, name: "Alice Johnson", designation: "AI Engineer", image: "/logo.jpeg", linkedin: "https://linkedin.com/in/alicejohnson", github: "https://github.com/alicejohnson" },
  { id: 2, name: "Bob Smith", designation: "Frontend Developer", image: "/logo.jpeg", linkedin: "https://linkedin.com/in/bobsmith", github: "https://github.com/bobsmith" },
  { id: 3, name: "Charlie Brown", designation: "Backend Developer", image: "/logo.jpeg", linkedin: "https://linkedin.com/in/charliebrown", github: "https://github.com/charliebrown" },
  { id: 4, name: "Dana Lee", designation: "Data Scientist", image: "/logo.jpeg", linkedin: "https://linkedin.com/in/danalee", github: "https://github.com/danalee" }
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
              <div className="bg-black border-2 border-orange-500 text-white p-8 rounded-2xl shadow-md w-full h-full flex flex-row  items-center justify-center">
                <div className="laptop scale-90 mr-32">
                  <div className="screen relative h-[318px] w-[518px] m-auto p-[9px] flex items-center justify-center bg-gradient-to-br from-[#3f51b1] via-[#a86aa4] to-[#f7c978] rounded-[20px] ">
                    <div className="header w-[100px] h-[12px] absolute top-[10px] left-1/2 -translate-x-1/2 bg-slate-500 rounded-b-[6px]">
                      <div className="bg-black p-1 rounded-full w-[10px] h-[10px]  m-auto"></div>
                    </div>
                    <iframe
                      src={selectedModel.video}
                      title={selectedModel.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-[20px]"
                    />
                    <div className="absolute bottom-[2px] w-[522px] h-[24px] bg-gradient-to-b from-[#272727] to-[#0d0d0d] rounded-b-[20px]"></div>
                  </div>

                  <div className="keyboard relative z-[200] mt-[-10px] w-[620px] h-[24px] bg-zinc-800 rounded-t-[2px] rounded-b-[12px] border-t-[1px] border-x-[2px] border-b-1 border-[#a0a3a7] ">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[10px] bg-[#e2e3e4] rounded-b-[10px] shadow-inner-secondary"></div>
                  </div>
                </div>
                <div>
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

      {/* Contacts Section */}
      <div id="devs" className="flex flex-col items-center w-full max-w-9xl mt-32 text-center px-4 mb-10 lg:px-0">
        <div className="w-full">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-8">Meet Our Developers:</h1>
          <div className="bg-gray-100 border border-gray-300 p-6 lg:p-10 rounded-2xl shadow-inner w-full bg-opacity-35 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {developers.map(dev => (
                <div key={dev.id} className="bg-white border border-gray-300 p-6 rounded-2xl shadow-md flex flex-col items-center">
                  <img 
                    src={dev.image} 
                    alt={dev.name} 
                    className="w-32 h-32 object-cover rounded-full mb-4" 
                  />
                  <h2 className="text-xl font-bold mb-2">{dev.name}</h2>
                  <p className="text-gray-600 mb-4">{dev.designation}</p>
                  <div className="flex space-x-4">
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <FaLinkedin size={24} />
                    </a>
                    <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-600">
                      <FaGithub size={24} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
