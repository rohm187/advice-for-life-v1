'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, TrendingUp, X, Check, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BusinessIdea {
  id: string;
  submitterName: string;
  submitterEmail: string;
  businessName: string;
  description: string;
  whyItMatters: string;
  status: string;
  equityPercentage: number | null;
  adminNotes: string | null;
  createdAt: string;
}

export default function BusinessIdeasClient() {
  const router = useRouter();
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBusinessIdeas();
  }, [filterStatus]);

  const fetchBusinessIdeas = async () => {
    try {
      setLoading(true);
      const url = filterStatus 
        ? `/api/business-ideas?status=${filterStatus}`
        : '/api/business-ideas';
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setBusinessIdeas(data.businessIdeas || []);
        setStatusCounts(data.statusCounts || {});
      } else {
        toast.error('Failed to load business ideas');
      }
    } catch (error) {
      console.error('Error fetching business ideas:', error);
      toast.error('Failed to load business ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, equityPercentage?: number) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/business-ideas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          equityPercentage: equityPercentage || null,
        }),
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchBusinessIdeas();
        setShowModal(false);
        setSelectedIdea(null);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business idea?')) return;

    try {
      const response = await fetch(`/api/business-ideas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Business idea deleted');
        fetchBusinessIdeas();
      } else {
        toast.error('Failed to delete business idea');
      }
    } catch (error) {
      console.error('Error deleting business idea:', error);
      toast.error('Failed to delete business idea');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'under_review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'selected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-white">Business Idea Submissions</h1>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{statusCounts.pending || 0}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{statusCounts.under_review || 0}</div>
              <div className="text-sm text-gray-400">Under Review</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{statusCounts.selected || 0}</div>
              <div className="text-sm text-gray-400">Selected</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{statusCounts.rejected || 0}</div>
              <div className="text-sm text-gray-400">Rejected</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-400">
                {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === ''
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {['pending', 'under_review', 'selected', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  filterStatus === status
                    ? 'bg-amber-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Business Ideas List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading business ideas...</p>
          </div>
        ) : businessIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No business ideas found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {businessIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-amber-500/30 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{idea.businessName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(idea.status)}`}>
                        {idea.status.replace('_', ' ')}
                      </span>
                      {idea.equityPercentage && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {idea.equityPercentage}% Equity
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Submitted by {idea.submitterName} ({idea.submitterEmail}) on{' '}
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedIdea(idea);
                        setShowModal(true);
                      }}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Description:</p>
                    <p className="text-gray-300">{idea.description.substring(0, 200)}...</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Why It Matters:</p>
                    <p className="text-gray-300">{idea.whyItMatters.substring(0, 150)}...</p>
                  </div>
                </div>

                {/* Quick Actions */}
                {idea.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleUpdateStatus(idea.id, 'under_review')}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm disabled:opacity-50"
                    >
                      Mark as Under Review
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIdea(idea);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                      Select & Assign Equity
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(idea.id, 'rejected')}
                      disabled={updating}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition text-sm disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for detailed view and status update */}
      {showModal && selectedIdea && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
              <h2 className="text-2xl font-bold text-white">{selectedIdea.businessName}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedIdea(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Submitter:</p>
                <p className="text-white">{selectedIdea.submitterName}</p>
                <p className="text-gray-400 text-sm">{selectedIdea.submitterEmail}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Description:</p>
                <p className="text-gray-300">{selectedIdea.description}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Why It Matters:</p>
                <p className="text-gray-300">{selectedIdea.whyItMatters}</p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <p className="text-gray-400 text-sm mb-4">Update Status:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedIdea.id, 'under_review')}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition disabled:opacity-50"
                  >
                    Mark as Under Review
                  </button>
                  <button
                    onClick={() => {
                      const equity = prompt('Enter equity percentage (e.g., 5):');
                      if (equity && !isNaN(Number(equity))) {
                        handleUpdateStatus(selectedIdea.id, 'selected', Number(equity));
                      }
                    }}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition disabled:opacity-50"
                  >
                    Select & Assign Equity
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedIdea.id, 'rejected')}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
