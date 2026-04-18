import { Construction } from "lucide-react";

export default function Challenges() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Construction className="text-white" size={40} />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">We're Working on It!</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          This page is currently under construction. Please check back soon for updates.
        </p>
        
        <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mb-2">
          <div className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
        </div>
        <p className="text-gray-500 text-sm">Development in progress...</p>
      </div>
    </div>
  );
}