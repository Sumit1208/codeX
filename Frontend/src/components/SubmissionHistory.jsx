
import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Submission History</h2>
      
      {submissions.length === 0 ? (
        <div className="alert bg-gray-800 border border-gray-700 shadow-lg">
          <div className="text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="text-gray-300">#</th>
                  <th className="text-gray-300">Language</th>
                  <th className="text-gray-300">Status</th>
                  <th className="text-gray-300">Runtime</th>
                  <th className="text-gray-300">Memory</th>
                  <th className="text-gray-300">Test Cases</th>
                  <th className="text-gray-300">Submitted</th>
                  <th className="text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-gray-800 border-gray-700">
                    <td className="text-gray-300">{index + 1}</td>
                    <td className="font-mono text-gray-300">{sub.language}</td>
                    <td>
                      <span className={`badge ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="font-mono text-gray-300">{sub.runtime}sec</td>
                    <td className="font-mono text-gray-300">{formatMemory(sub.memory)}</td>
                    <td className="font-mono text-gray-300">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="text-gray-300">{formatDate(sub.createdAt)}</td>
                    <td>
                      <button 
                        className="btn btn-sm bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg mb-4 text-gray-100">
              Submission Details: {selectedSubmission.language}
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="badge bg-gray-700 text-gray-300 border-gray-600">
                  Runtime: {selectedSubmission.runtime}s
                </span>
                <span className="badge bg-gray-700 text-gray-300 border-gray-600">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge bg-gray-700 text-gray-300 border-gray-600">
                  Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                </span>
              </div>
              
              {selectedSubmission.errorMessage && (
                <div className="alert bg-red-900/30 border border-red-800 mt-2">
                  <div className="text-red-300">
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
            
            <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto border border-gray-700">
              <code className="text-green-200">{selectedSubmission.code}</code>
            </pre>
            
            <div className="modal-action">
              <button 
                className="btn bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default SubmissionHistory;
