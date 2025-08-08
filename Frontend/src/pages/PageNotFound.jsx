import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  return (
    <section className="flex items-center justify-center my-20 bg-gray-100 text-center p-6">
      <motion.div
        className="bg-white p-10 rounded-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! That page can’t be found.
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          It looks like nothing was found at this location.{' '}
          Visit our{' '}
          <Link
            to="/"
            className="text-[#0abb87] hover:text-green-600 font-semibold"
          >
            Homepage
          </Link>
          , please.
        </p>
      </motion.div>
    </section>
  );
}
