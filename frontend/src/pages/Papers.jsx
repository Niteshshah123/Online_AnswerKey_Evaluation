import React, { useEffect, useState } from 'react';
import { usePapersStore } from '../store/papers.js';
import { Link } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { getStatusColor, getStatusText } from '../utils/index.js';

export default function Papers() {
  const { papers, total, page, isLoading, error, fetchPapers, searchPapers, clearError } = usePapersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPapers(currentPage, pageSize);
  }, [currentPage, fetchPapers]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage(1);
      searchPapers(searchQuery, 1, pageSize);
    } else {
      fetchPapers(1, pageSize);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearError();
    fetchPapers(1, pageSize);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Assigned Papers</h1>
        <p className="mt-1 text-gray-600">View and evaluate your assigned papers.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 flex items-center rounded-lg border border-gray-300 bg-white px-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by roll number or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none bg-transparent py-2 pl-2 outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg bg-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      )}

      {/* Papers Table */}
      {!isLoading && papers.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr key={paper.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{paper.rollNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{paper.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{paper.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusColor(paper.status)}`}>
                        {getStatusText(paper.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/evaluation/${paper.id}`}
                        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Evaluate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} papers
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && papers.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-lg text-gray-600">No papers found</p>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Check back later for assigned papers.'}
          </p>
        </div>
      )}
    </div>
  );
}
