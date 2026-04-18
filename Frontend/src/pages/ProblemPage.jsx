import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { Play, Send } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const [activeConsoleTab, setActiveConsoleTab] = useState('input');
  const consoleRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState('60%');
  const [leftWidth, setLeftWidth] = useState('50%');
  const [isResizing, setIsResizing] = useState(false);

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error running code:', error.message);
      setRunResult({
        success: false,
        error: 'Internal server error',
      });
      setLoading(false);
    }
    setActiveConsoleTab('input');
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
    }
    setActiveConsoleTab('result');
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Vertical resize handler for left/right panels
  const handleResizeVertical = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = parseInt(leftWidth, 10);
    const containerWidth = window.innerWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(30, Math.min(70, ((startWidth / 100 * containerWidth + deltaX) / containerWidth) * 100));
      setLeftWidth(`${newWidth}%`);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Horizontal resize handler for editor/console
  const handleResizeHorizontal = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startY = e.clientY;
    const startHeight = parseInt(editorHeight, 10);
    const containerHeight = window.innerHeight * 0.9; // 90vh container

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(30, Math.min(80, ((startHeight / 100 * containerHeight + deltaY) / containerHeight) * 100));
      setEditorHeight(`${newHeight}%`);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Prevent text selection during resize
  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className={`h-[90vh] flex bg-linear-to-br from-gray-900 to-gray-800 transition-colors duration-300 fixed w-full ${isResizing ? 'select-none' : ''}`}>
      {/* Left Panel */}
      <div 
        style={{ width: leftWidth }} 
        className="flex flex-col border-r border-gray-700 bg-gray-800/90 transition-all duration-150"
      >
        {/* Left Tabs */}
        <div className="tabs bg-gray-800 px-4 shadow-sm rounded-lg">
  {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map((tab) => (
    <button 
      key={tab}
      className={`tab flex-1 rounded-lg m-1 text-sm font-medium ${
        activeLeftTab === tab 
          ? 'bg-primary text-white shadow-sm'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      } `}
      onClick={() => setActiveLeftTab(tab)}
    >
      {tab === 'chatAI' ? 'Chat AI' : tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white dark:text-gray-100">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-white dark:text-gray-300 leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Examples:</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
                            <h4 className="font-semibold text-gray-200 mb-2">Example {index + 1}:</h4>
                            <div className="space-y-2 text-sm font-mono text-gray-400">
                              <div><strong className="text-gray-300">Input:</strong> <span className="text-blue-300">{example.input}</span></div>
                              <div><strong className="text-gray-300">Output:</strong> <span className="text-green-300">{example.output}</span></div>
                              {example.explanation && (
                                <div><strong className="text-gray-300">Explanation:</strong> <span className="text-yellow-300">{example.explanation}</span></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-white dark:text-white mb-4">Editorial</h2>
                  <div className="text-gray-700 dark:text-gray-300">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-4">Solutions</h2>
                  <div className="space-y-4">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-gray-600 rounded-lg">
                        <div className="bg-gray-700 px-4 py-3 rounded-t-lg">
                          <h3 className="font-semibold text-gray-200">
                            {problem.title} - {solution.language}
                          </h3>
                        </div>
                        <div className="p-4 bg-gray-800">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto border border-gray-700">
                            <code className="text-white">{solution.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-400 text-center py-8">
                        Solutions will be available after you solve the problem.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-4">My Submissions</h2>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="h-full">
                  <h2 className="text-xl font-bold text-white-900 dark:text-white-100 mb-4">Chat with AI</h2>
                  <ChatAi problem={problem} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Vertical Resizer */}
      <div
        className="w-2 bg-gray-300 dark:bg-gray-600 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-150 flex items-center justify-center"
        onMouseDown={handleResizeVertical}
      >
        <div className="w-1 h-8 bg-gray-400 dark:bg-gray-500 rounded"></div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-gray-800/90">
        {/* Language Selector */}
        <div className="flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-600">
          <div className="flex gap-2">
            {['javascript', 'java', 'cpp'].map((lang) => (
              <button
                key={lang}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === lang 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
              </button>
            ))}
          </div>
        </div>

        {/* Editor and Console Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Monaco Editor */}
          <div 
            style={{ height: editorHeight }} 
            className="relative border-b border-gray-300 dark:border-gray-600"
          >
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                mouseWheelZoom: true,
              }}
            />
          </div>

          {/* Horizontal Resizer */}
          <div
            className="h-2 bg-gray-300 dark:bg-gray-600 cursor-row-resize hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-150 flex items-center justify-center"
            onMouseDown={handleResizeHorizontal}
          >
            <div className="h-1 w-8 bg-gray-400 dark:bg-gray-500 rounded"></div>
          </div>

          {/* Console Section */}
          <div 
            ref={consoleRef} 
            className="flex-1 flex flex-col min-h-0 bg-gray-900 text-gray-200"
          >
            {/* Console Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex space-x-4">
                <button
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    activeConsoleTab === 'input' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveConsoleTab('input')}
                >
                  Test Cases
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    activeConsoleTab === 'result' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveConsoleTab('result')}
                >
                  Result
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium border border-gray-600 transition-colors duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 hover:border-gray-500'
                  }`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  <Play size={14} /> Run
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-green-600 text-white transition-colors duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  <Send size={14} /> Submit
                </button>
              </div>
            </div>

            {/* Console Content - Fixed height with scrolling */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {activeConsoleTab === 'input' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-100 mb-3">Test Results:</h4>
                  {runResult ? (
                    <div className={`p-3 rounded ${runResult.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                      {runResult.success ? (
                        <div className="text-green-400">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">✅</span>
                            <span className="font-bold">All test cases passed!</span>
                          </div>
                          <div className="text-gray-300 text-xs space-y-1 ml-6">
                            <div>Runtime: {runResult.runtime} sec</div>
                            <div>Memory: {runResult.memory} KB</div>
                          </div>
                          <div className="mt-3 space-y-2">
                            {runResult.testCases?.map((tc, i) => (
                              <div key={i} className="bg-gray-800 p-2 rounded text-xs">
                                <div className="text-gray-400">Test Case {i + 1}:</div>
                                <div className="ml-2">
                                  <div><span className="text-gray-500">Input:</span> {tc.stdin}</div>
                                  <div><span className="text-gray-500">Expected:</span> {tc.expected_output}</div>
                                  <div><span className="text-gray-500">Output:</span> {tc.stdout}</div>
                                  <div className="text-green-500 mt-1">✓ Passed</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-400">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">❌</span>
                            <span className="font-bold">Test Cases Failed</span>
                          </div>
                          <div className="mt-3 space-y-2">
                            {runResult.testCases?.map((tc, i) => (
                              <div key={i} className="bg-gray-800 p-2 rounded text-xs">
                                <div className="text-gray-400">Test Case {i + 1}:</div>
                                <div className="ml-2">
                                  <div><span className="text-gray-500">Input:</span> {tc.stdin}</div>
                                  <div><span className="text-gray-500">Expected:</span> {tc.expected_output}</div>
                                  <div><span className="text-gray-500">Output:</span> {tc.stdout}</div>
                                  <div className={tc.status_id === 3 ? 'text-green-500 mt-1' : 'text-red-500 mt-1'}>
                                    {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Click "Run" to test your code with the example test cases.
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'result' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-100 mb-3">Submission Result:</h4>
                  {submitResult ? (
                    <div className={`p-3 rounded ${submitResult.accepted ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                      {submitResult.accepted ? (
                        <div className="text-green-400">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🎉</span>
                            <span className="font-bold">Accepted!</span>
                          </div>
                          <div className="text-gray-300 text-xs space-y-1 ml-6">
                            <div>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</div>
                            <div>Runtime: {submitResult.runtime} sec</div>
                            <div>Memory: {submitResult.memory} KB</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-400">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">❌</span>
                            <span className="font-bold">{submitResult.error || 'Wrong Answer'}</span>
                          </div>
                          <div className="text-gray-300 text-xs ml-6">
                            Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Click "Submit" to see your submission result.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

