
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Search } from 'lucide-react';

function Problems(){
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
      const [problems, setProblems] = useState([]);
      const [solvedProblems, setSolvedProblems] = useState([]);
      const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all' ,
        searchQuery: ''
      });
    
      useEffect(() => {
        const fetchProblems = async () => {
          try {
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
          } catch (error) {
            console.error('Error fetching problems:', error);
          }
        };
    
        const fetchSolvedProblems = async () => {
          try {
            const { data } = await axiosClient.get('/problem/problemSolvedByUser');
            setSolvedProblems(data);
          } catch (error) {
            console.error('Error fetching solved problems:', error);
          }
        };
    
        fetchProblems();
        if (user) fetchSolvedProblems();
      }, [user]);
    
      const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
        const statusMatch = filters.status === 'all' || 
                          (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id)) ||
                          (filters.status === 'unsolved' && !solvedProblems.some(sp => sp._id === problem._id));
        const searchMatch = problem.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                        problem.tags.toLowerCase().includes(filters.searchQuery.toLowerCase());
        return difficultyMatch && tagMatch && statusMatch && searchMatch;
      });

    const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
      }
    };


    return(
        <>
      <div className="container mx-auto lg:px-24 text-white">
        <h1 className="text-3xl font-bold mb-6">Problems</h1>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl bg-gray-800 shadow-md">
          {/* Search Input */}
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search problems..."
              className="input w-full pl-10 rounded-full bg-gray-700 border-gray-600 text-white"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>

          {/* Status Filter */}
          <select
            className="select rounded-full bg-gray-700 border-gray-600 text-white"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="select rounded-full bg-gray-700 border-gray-600 text-white"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Tag Filter */}
          <select
            className="select rounded-full bg-gray-700 border-gray-600 text-white"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="string">String</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <div key={problem._id} className="card bg-gray-800 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="card-title">
                      <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                        {index + 1}. {problem.title}
                      </NavLink>
                    </h2>
                    {solvedProblems.some(sp => sp._id === problem._id) && (
                      <div className="badge badge-success gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Solved
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </div>
                    <div className="badge badge-info">
                      {problem.tags}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 p-8">
              No problems found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
    )
}


export default Problems;