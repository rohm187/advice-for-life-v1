'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Save,
  X,
  TrendingUp,
  Flame,
  Loader2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Business {
  id: string
  name: string
  description: string
  launchDate: string
  websiteLink?: string
  status: string
  category?: string
  milestone?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface FormData {
  name: string
  description: string
  launchDate: string
  websiteLink: string
  status: string
  category: string
  milestone: string
  imageUrl: string
}

const initialFormData: FormData = {
  name: '',
  description: '',
  launchDate: new Date()?.toISOString()?.split('T')?.[0] ?? '',
  websiteLink: '',
  status: 'active',
  category: '',
  milestone: '',
  imageUrl: '',
}

export default function DashboardClient() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchBusinesses()
    }
  }, [status, router])

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses')
      if (response?.ok) {
        const data = await response.json()
        setBusinesses(data?.businesses ?? [])
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error('Failed to load businesses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e?.preventDefault?.()
    setSubmitting(true)

    try {
      const url = editingId ? `/api/businesses/${editingId}` : '/api/businesses'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response?.ok) {
        toast.success(editingId ? 'Business updated!' : 'Business added!')
        setShowForm(false)
        setEditingId(null)
        setFormData(initialFormData)
        fetchBusinesses()
      } else {
        const data = await response.json()
        toast.error(data?.error ?? 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving business:', error)
      toast.error('Failed to save business')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (business: Business) => {
    setFormData({
      name: business?.name ?? '',
      description: business?.description ?? '',
      launchDate: business?.launchDate?.split('T')?.[0] ?? '',
      websiteLink: business?.websiteLink ?? '',
      status: business?.status ?? 'active',
      category: business?.category ?? '',
      milestone: business?.milestone ?? '',
      imageUrl: business?.imageUrl ?? '',
    })
    setEditingId(business?.id ?? null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return

    try {
      const response = await fetch(`/api/businesses/${id}`, {
        method: 'DELETE',
      })

      if (response?.ok) {
        toast.success('Business deleted')
        fetchBusinesses()
      } else {
        toast.error('Failed to delete business')
      }
    } catch (error) {
      console.error('Error deleting business:', error)
      toast.error('Failed to delete business')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(initialFormData)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  const activeCount = businesses?.filter(b => b?.status === 'active')?.length ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-xl font-bold">
                <span className="gold-gradient">Admin</span> Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-sm font-medium text-white">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-600/10 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold gold-gradient">{businesses?.length ?? 0}/100</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Total Businesses</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500">{activeCount}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Active Businesses</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-500">{Math.round((businesses?.length ?? 0) / 100 * 100)}%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Progress to Goal</p>
          </div>
        </div>

        {/* Add Business Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-600/30"
            >
              <Plus className="w-5 h-5" />
              Add Business
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit' : 'Add'} <span className="gold-gradient">Business</span>
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData?.name}
                    onChange={(e) => setFormData({ ...formData, name: e?.target?.value ?? '' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Launch Date *
                  </label>
                  <input
                    type="date"
                    value={formData?.launchDate}
                    onChange={(e) => setFormData({ ...formData, launchDate: e?.target?.value ?? '' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData({ ...formData, description: e?.target?.value ?? '' })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                  rows={3}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData?.websiteLink}
                    onChange={(e) => setFormData({ ...formData, websiteLink: e?.target?.value ?? '' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="https://example.com"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData?.status}
                    onChange={(e) => setFormData({ ...formData, status: e?.target?.value ?? 'active' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    disabled={submitting}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData?.category}
                    onChange={(e) => setFormData({ ...formData, category: e?.target?.value ?? '' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="e.g., E-commerce, SaaS, Consulting"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData?.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e?.target?.value ?? '' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="https://i.ytimg.com/vi/SqJZD0OdT1g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBXH_0noVUYopA5FSlfQFjMxj-fbQ"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Milestone/Achievement
                </label>
                <input
                  type="text"
                  value={formData?.milestone}
                  onChange={(e) => setFormData({ ...formData, milestone: e?.target?.value ?? '' })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="e.g., First $10K month, 1000 customers"
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingId ? 'Update' : 'Add'} Business</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Business List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">All Businesses</h2>
          {businesses?.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
              <Flame className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No businesses yet. Add your first one!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {businesses?.map?.((business) => (
                <div
                  key={business?.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex gap-6">
                    {business?.imageUrl && (
                      <div className="relative w-32 h-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={business?.imageUrl}
                          alt={business?.name ?? 'Business'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{business?.name}</h3>
                          <p className="text-gray-400 text-sm">{business?.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {business?.status === 'active' && (
                            <span className="px-3 py-1 bg-green-600/20 text-green-500 text-xs font-semibold rounded-full">
                              Active
                            </span>
                          )}
                          {business?.status === 'paused' && (
                            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-500 text-xs font-semibold rounded-full">
                              Paused
                            </span>
                          )}
                          {business?.status === 'completed' && (
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-500 text-xs font-semibold rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>Launched: {new Date(business?.launchDate)?.toLocaleDateString()}</span>
                        {business?.category && (
                          <>
                            <span>•</span>
                            <span>{business?.category}</span>
                          </>
                        )}
                        {business?.websiteLink && (
                          <a
                            href={business?.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors"
                          >
                            <span>Visit Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {business?.milestone && (
                        <div className="mb-3">
                          <span className="text-xs text-gray-400">Milestone: </span>
                          <span className="text-sm text-amber-500">{business?.milestone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(business)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(business?.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-medium rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
