"use client";

import { motion } from "framer-motion";
import { Laptop, Cpu, Tags, Database } from "lucide-react";

interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  iconName?: string;
}

interface OQueDesenvolvoProps {
  services?: ServiceItem[];
}

export default function OQueDesenvolvo({ services = [] }: OQueDesenvolvoProps) {
  if (!services || services.length === 0) return null;

  const getIcon = (name?: string) => {
    switch (name) {
      case "Laptop":
        return <Laptop className="size-8 text-accent stroke-[1.5]" />;
      case "Cpu":
        return <Cpu className="size-8 text-accent stroke-[1.5]" />;
      case "Tags":
        return <Tags className="size-8 text-accent stroke-[1.5]" />;
      case "Database":
        return <Database className="size-8 text-accent stroke-[1.5]" />;
      default:
        return <Laptop className="size-8 text-accent stroke-[1.5]" />;
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  } as const;

  return (
    <section className="bg-primary py-24 px-6 sm:px-10 transition-colors" id="servicos">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mb-4">
            O Que Eu Desenvolvo
          </h2>
          <p className="font-sans text-text-secondary text-base max-w-[500px] mx-auto">
            Soluções técnicas robustas voltadas para a automação comercial, otimização de processos e sistemas corporativos escaláveis.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((servico, idx) => (
            <motion.div
              key={servico.id || idx}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-8 sm:p-10 rounded-[32px] flex flex-col gap-6 items-start transition-all"
              style={{ transition: "background-color 0.3s, border-color 0.3s" }}
            >
              {/* Feature Icon Container */}
              <div className="relative size-16 rounded-[20px] flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-[20px] border border-accent/30 pointer-events-none" />
                <div className="flex items-center justify-center size-full p-3 text-text-primary">
                  {getIcon(servico.iconName)}
                </div>
              </div>

              <div>
                <h3 className="font-sans font-semibold text-text-primary text-xl sm:text-2xl leading-tight mb-3">
                  {servico.title}
                </h3>
                <p className="font-sans text-text-secondary text-base leading-relaxed">
                  {servico.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
