import React from 'react';
import { motion } from 'framer-motion';

const TeamStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="mt-16 bg-white rounded-lg p-8 shadow-lg"
    >
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">9</div>
          <div className="text-gray-600">Teammitglieder</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">133+</div>
          <div className="text-gray-600">Jahre Gesamterfahrung</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">55+</div>
          <div className="text-gray-600">Jahre Firmengeschichte</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
          <div className="text-gray-600">Engagement</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamStats;