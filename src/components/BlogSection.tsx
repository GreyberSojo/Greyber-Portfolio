"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "5 Tips para Automatizar con Playwright",
    img: "/blog/post1.jpg",
    url: "/blog/playwright-tips",
  },
  {
    title: "Buenas prácticas en QA para videojuegos",
    img: "/blog/post2.jpg",
    url: "/blog/qa-games",
  },
  {
    title: "Integrando Pytest con AWS Pipelines",
    img: "/blog/post3.jpg",
    url: "/blog/aws-pytest",
  },
];

export default function InsightsSection() {
  return (
    <section
      id="insights"
      className="w-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white py-16 px-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-center"
      >
        Notas Técnicas
      </motion.h2>

      <p className="text-center text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-12">
        Guías, ideas y aprendizajes sobre automatización, testing y desarrollo de videojuegos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {posts.map((post, i) => (
          <motion.a
            key={post.title}
            href={post.url}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="dark:bg-gray-700 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
          >
            <Image
              src={post.img}
              alt={post.title}
              width={500}
              height={300}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-cyan-400">{post.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button className="bg-cyan-400 text-gray-900 hover:bg-cyan-500">
          Ir al blog
        </Button>
      </div>
    </section>
  );
}
