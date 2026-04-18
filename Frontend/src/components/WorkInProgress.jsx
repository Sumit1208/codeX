import { Construction, Code, Coffee, Clock } from "lucide-react";
import { useNavigate, NavLink, Link } from 'react-router'; 

export default function WorkInProgress() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Construction Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <Construction className="text-white" size={48} />
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Code className="text-gray-900" size={16} />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
            <Coffee className="text-gray-900" size={16} />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-5xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Work in Progress
        </h1>
        
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            We're working hard to bring you an amazing experience! This page is currently under construction and will be available soon.
          </p>

          {/* Progress Indicators */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <Clock className="animate-spin" size={20} />
              <span className="text-sm">Coding in progress...</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"
                style={{ width: '75%' }}
              ></div>
            </div>
            
            <div className="text-xs text-gray-500">Estimated completion: 75%</div>
          </div>

          {/* Features Coming Soon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Code className="text-blue-400" size={16} />
              </div>
              <h3 className="text-white font-semibold text-sm">New Features</h3>
              <p className="text-gray-400 text-xs">Exciting updates coming soon</p>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Construction className="text-green-400" size={16} />
              </div>
              <h3 className="text-white font-semibold text-sm">Better Design</h3>
              <p className="text-gray-400 text-xs">Improved user experience</p>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-4">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Coffee className="text-yellow-400" size={16} />
              </div>
              <h3 className="text-white font-semibold text-sm">More Content</h3>
              <p className="text-gray-400 text-xs">Fresh content being prepared</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              In the meantime, feel free to explore our other pages or check back later!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink 
              to="/"
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 text-center"
            >
              Go to Homepage
            </NavLink>
              
              <button className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-700/70 transition-all duration-200 border border-gray-600/50">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Thank you for your patience! 🚀</p>
        </div>
      </div>
    </div>
  );
}