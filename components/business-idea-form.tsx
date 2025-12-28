'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Send, TrendingUp, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BusinessIdeaForm() {
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    businessName: '',
    description: '',
    whyItMatters: '',
  });

  // Fetch total submissions count
  useEffect(() => {
    fetch('/api/business-ideas/count')
      .then(res => res.json())
      .then(data => setTotalSubmissions(data.totalCount || 0))
      .catch(err => console.error('Error fetching count:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/business-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Business idea submitted successfully! 🎉');
        // Reset form
        setFormData({
          submitterName: '',
          submitterEmail: '',
          businessName: '',
          description: '',
          whyItMatters: '',
        });
        // Update count
        setTotalSubmissions(prev => prev + 1);
      } else {
        toast.error(data.error || 'Failed to submit business idea');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 opacity-50" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 font-medium">Be Part of the Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Submit Your Business Idea
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Got a business idea? Share it with me. If I choose yours as one of the <span className="text-amber-400 font-semibold">100 businesses</span> I'm building, <span className="text-amber-400 font-semibold">you'll get equity</span>. This is your chance to be part of something real.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-bold text-white">{totalSubmissions}</span>
              <span className="text-zinc-400">Ideas Submitted</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-zinc-400">Winners Get Equity</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="submitterName" className="block text-sm font-medium text-zinc-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="submitterName"
                name="submitterName"
                value={formData.submitterName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="submitterEmail" className="block text-sm font-medium text-zinc-300 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                id="submitterEmail"
                name="submitterEmail"
                value={formData.submitterEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="businessName" className="block text-sm font-medium text-zinc-300 mb-2">
              Business Name/Title *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="e.g., AI-Powered Meal Planner for Busy Professionals"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
              Detailed Business Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              placeholder="Describe your business idea in detail. What problem does it solve? How does it work? Who is the target customer?"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="whyItMatters" className="block text-sm font-medium text-zinc-300 mb-2">
              Why This Business Matters *
            </label>
            <textarea
              id="whyItMatters"
              name="whyItMatters"
              value={formData.whyItMatters}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              placeholder="Why should this business exist? What impact will it have? Why are you passionate about this idea?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-4 px-8 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Your Idea
              </>
            )}
          </button>

          <p className="text-sm text-zinc-500 text-center mt-4">
            By submitting, you acknowledge that if your idea is selected, we'll work out the equity details together.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
