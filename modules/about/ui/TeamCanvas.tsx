'use client'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { PointCloud } from './PointCloud'
import { TEAM_MEMBERS } from '@/constants/data'

export default function TeamCanvas() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <main className="bg-black text-white">
        <section className="h-screen flex items-center px-10">
          <h1 className="text-8xl font-bold">OUR TEAM</h1>
        </section>
      {/* 1. FIXED 3D BACKGROUND */}
      <div className=" inset-0 h-screen w-full z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <PointCloud activeTexture={TEAM_MEMBERS[activeIdx].texture} />
        </Canvas>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="relative z-10">
        {/* Spacer for top content */}

        {TEAM_MEMBERS.map((member, i) => (
          // Change 'section' to 'motion.section'
          <motion.section
            key={member.id}
            className="h-screen flex flex-col justify-center px-20 max-w-2xl"
            // onViewportEnter now works because this is a motion component
            onViewportEnter={() => setActiveIdx(i)}
            viewport={{ amount: 0.5 }} // Optional: triggers when 50% of the section is visible
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-cyan-400 font-mono tracking-widest">{member.role}</span>
              <h2 className="text-7xl font-bold mt-4 mb-6">{member.name}</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                {member.description}
              </p>
            </motion.div>
          </motion.section>
        ))}

        <div className="h-screen" /> {/* Bottom Spacer */}
      </div>
    </main>
  )
}