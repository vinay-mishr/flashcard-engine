'use client';
import { motion } from 'framer-motion';
import { Brain, Zap, BarChart3, ArrowRight, BookOpen, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const steps = [
    {
      icon: '📄',
      step: 'Step 1: Upload',
      title: 'Upload Your Material',
      desc: 'Drop in any PDF — textbook chapters, class notes, study guides. Our AI reads and understands everything.',
    },
    {
      icon: '🃏',
      step: 'Step 2: Practice',
      title: 'Smart Flashcards Generated',
      desc: 'Get 15–25 high-quality cards covering key concepts, definitions, formulas, and worked examples.',
    },
    {
      icon: '🧠',
      step: 'Step 3: Master',
      title: 'Test Yourself',
      desc: 'Our spaced repetition engine shows you cards at the perfect moment. Hard cards come back. Easy ones fade.',
    },
  ];

  const features = [
    {
      icon: <Zap className="text-yellow-500" size={22} />,
      title: 'AI-Powered Extraction',
      desc: 'Not shallow scraping. Cards written like a great teacher made them — concepts, edge cases, examples.',
    },
    {
      icon: <BarChart3 className="text-indigo-500" size={22} />,
      title: 'Spaced Repetition (SM-2)',
      desc: 'The scientifically proven algorithm used by Anki. Cards you struggle with show up more. Mastered ones fade.',
    },
    {
      icon: <BookOpen className="text-green-500" size={22} />,
      title: 'Track Your Progress',
      desc: 'See what you have mastered, what is shaky, and what is due for review. Stay motivated, not overwhelmed.',
    },
    {
      icon: <Star className="text-pink-500" size={22} />,
      title: 'Beautiful Experience',
      desc: 'Smooth card flips, streak tracking, session stats. Studying does not have to be boring.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Brain size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">FlashMind</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/auth')}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/auth')}
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-2 rounded-full inline-block mb-6 tracking-wide uppercase">
            AI-Powered Study Tool
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Turn any PDF into a{' '}
            <span className="text-indigo-600">smart flashcard</span>{' '}
            deck
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your notes, textbook chapters, or study guides. Our AI creates
            high-quality flashcards instantly — then helps you master them with
            spaced repetition.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => router.push('/auth')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
            >
              Start for Free <ArrowRight size={20} />
            </button>
            <p className="text-sm text-gray-400">No credit card required</p>
          </div>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-center text-gray-400 mb-14 max-w-xl mx-auto">
            From PDF to mastery in three simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition"
              >
                <div className="text-5xl mb-4">{s.icon}</div>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">{s.step}</p>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why FlashMind?
        </h2>
        <p className="text-center text-gray-400 mb-14 max-w-xl mx-auto">
          Built on cognitive science. Designed for real students.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 transition"
            >
              <div className="bg-white rounded-xl p-3 h-fit shadow-sm border border-gray-100">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-indigo-600 py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            Join thousands of students who stopped re-reading and started actually learning.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition shadow-xl text-lg"
          >
            Get Started Free →
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-300 text-sm border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain size={16} className="text-indigo-400" />
          <span className="font-semibold text-gray-500">FlashMind</span>
        </div>
        Built with AI · Powered by spaced repetition
      </footer>
    </div>
  );
}