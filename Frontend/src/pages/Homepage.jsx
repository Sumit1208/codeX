import { NavLink, Link } from 'react-router';
import { Code2, Rocket, Users, Trophy, Zap, Star, ChevronRight, Play, Shield, Clock, MessageCircle, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import { useSelector } from 'react-redux';
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";


// ... keep your existing styles constant ...
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulseSlow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-fade-in { animation: fadeIn 1s ease-in-out; }
  .animate-pulse-slow { animation: pulseSlow 2s infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }
`;

 const company = [
    { name: "About Us", path: "/about" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const support = [
    {name: "Contact Us", path: "/path"},
    {name: "Community", path: "/community"},
    {name: "Documentation", path: "/documentation"},
    
  ];

  const product = [
    {name: "Problems", path: "/problems"},
    {name: "Contests", path: "/contests"},
    { name: "Leaderboard", path: "/leaderboard" },
    {name: "Learning Paths", path: "/learningPaths"},
    // {name: "Interview Prep", path: "/interviewPrep"},
    // {name: "Code Editor", path: "/codeEditor"},
    
    
  ];

function Homepage() {
  const { isAuthenticated} = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-indigo-900 transition-colors duration-500  relative">
      <style>{styles}</style>
      
      {/* Animated background elements - updated for dark theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-10">
        {/* Hero Section - updated colors */}
        <section className="flex flex-col lg:flex-row items-center justify-between mb-24 ">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
              Master Your <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Coding Skills</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Welcome to codeX – your friendly, no‑pressure environment to grow as a programmer. Start coding now, completely free.
            </p>
            
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/problems" className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  <Code2 className="w-5 h-5 mr-2" /> Start Coding Now
                </NavLink>
                <NavLink to="/WorkInProgress" className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold flex items-center justify-center hover:bg-blue-900/20 transition-all">
                <Rocket className="w-5 h-5 mr-2" /> Join Contests
              </NavLink>
              </div>
              ):(
                <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/login" className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                <Code2 className="w-5 h-5 mr-2" /> Start Coding Now
              </NavLink>
              <NavLink to="/login" className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold flex items-center justify-center hover:bg-blue-900/20 transition-all">
                <Rocket className="w-5 h-5 mr-2" /> Join Contests
              </NavLink>
              </div>
              )}
              
            <div className="flex items-center mt-8 space-x-6 text-gray-400">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                <span>50,000+ Coders</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                <span>1,000+ Challenges</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-orange-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center animate-float">
            <div className="relative">
              <div className="w-80 h-80 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl transform rotate-6"></div>
              <div className="absolute top-0 left-0 w-80 h-80 bg-linear-to-br from-green-600 to-blue-700 rounded-2xl shadow-2xl transform -rotate-6"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-xl p-6 shadow-2xl w-64">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded text-gray-300">stress.js</span>
                  <Play className="w-5 h-5 text-green-400" />
                </div>
                <pre className="text-xs font-mono text-gray-300">
{`function badHabits() {
  let stress = 100;
  while (stress > 0) {
    console.log("🍺 Drinking beer...");
    console.log("🚬 Smoking cigarette...");
    stress -= 30;
  }
  return "Feeling fine... for now 😅";
}`}
                </pre>
                <div className="mt-4 flex justify-between text-xs text-gray-500">
                  <span>JavaScript</span>
                  <span>✓ Test Cases Passed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Challenge - updated */}
        <section id="challenges" className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Daily Challenge</h2>
            <div className="flex items-center text-blue-400 font-medium">
              <span>View All Challenges</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </div>
          </div>
          <div className="bg-linear-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -right-10 -bottom-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Medium</span>
                  <Clock className="w-4 h-4 ml-4 mr-1" />
                  <span>30 mins avg</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Reverse Nodes in k-Group</h3>
                <p className="mb-4 opacity-90">Given a NavLinked list, reverse the nodes of the list k at a time and return the modified list.</p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>2,453 attempted today</span>
                      </div>
                      <div className="flex items-center">
                         <Trophy className="w-4 h-4 mr-1" />
                          <span>50 XP reward</span>
                      </div>
                      </div>
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center">
                          Solve Challenge <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                </div>
                    </div>
           </div>
        </section>

        {/* Features Section - updated */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose codeX?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">We provide everything you need to improve your coding skills and advance your career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature cards */}
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Multi-Language Support</h3>
              <p className="text-gray-300">Code in Python, JavaScript, Java, C++, and 10+ other languages with our powerful online editor.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Real-time Execution</h3>
              <p className="text-gray-300">Test your code instantly with our fast execution environment and get immediate feedback.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Community Support</h3>
              <p className="text-gray-300">Join discussions, share solutions, and learn from a community of passionate developers.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Interview Prep</h3>
              <p className="text-gray-300">Practice with company-specific questions and mock interviews to ace your next technical interview.</p>
            </div>
            {/* Feature 5 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Weekly Contests</h3>
              <p className="text-gray-300">Compete with coders worldwide in our weekly contests and climb the global leaderboard.</p>
            </div>
            {/* Feature 6 */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Progress Tracking</h3>
              <p className="text-gray-300">Monitor your improvement with detailed analytics and personalized learning recommendations.</p>
            </div>
            
          </div>
        </section>

        {/* CTA Section  */}
        
        <section className="bg-linear-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-10 text-center text-white">
          
          <h2 className="text-3xl font-bold mb-4">Ready to Master Coding?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">Join thousands of developers who have improved their skills with codeX</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated?(
              <NavLink to="/problems">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Solve Problems
            </button>
          </NavLink>
            ):(
              <NavLink to="/signup">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Create Free Account
            </button>
          </NavLink>
            )}
            
            <button className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
              Take a Tour
            </button>
          </div>
        </section>
      </main>

      {/* Footer*/}
      <footer className="bg-gray-900/30 backdrop-blur-lg border-t border-gray-700/50 mt-20 relative">
      
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {/* Brand Column */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">codeX</h3>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6 max-w-md">
                      Built by developers, for developers. No fluff – just clean challenges, real‑time execution, and a community that wants you to succeed.
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => window.open('https://twitter.com', '_blank', 'noopener,noreferrer')}
                        className="text-zinc-400 hover:text-blue-400 p-2 hover:bg-white/10 rounded-lg"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => window.open('https://linkedin.com', '_blank', 'noopener,noreferrer')}
                        className="text-zinc-400 hover:text-blue-600 p-2 hover:bg-white/10 rounded-lg"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
                        className="text-zinc-400 hover:text-pink-500 p-2 hover:bg-white/10 rounded-lg"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
      
                  {/* Product Column */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase mb-4">Product</h3>
                    <ul className="space-y-3">
                      {product.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="text-base text-zinc-300 hover:text-green-400 transition-all duration-200 flex items-center group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
      
                  {/* Support Column */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase mb-4">Support</h3>
                    <ul className="space-y-3">
                      {support.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="text-base text-zinc-300 hover:text-green-400 transition-all duration-200 flex items-center group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
      
                  {/* Legal Column */}
                  
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase mb-4">Company</h3>
                    <ul className="space-y-3">
                      {company.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="text-base text-zinc-300 hover:text-green-400 transition-all duration-200 flex items-center group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
      
                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-zinc-700/50 text-center">
                  <p className="text-sm text-zinc-400">
                    Copyright &copy; {new Date().getFullYear()}  codeX – All rights reserved.
                  </p> 
                </div>
              </div>
      </footer>
    </div>
  );
}

export default Homepage;