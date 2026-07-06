"use client";

import { motion } from "framer-motion";

interface Experience {
  date: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

interface LinhaDoTempoProps {
  timeline?: Experience[];
  isEditable?: boolean;
  getEditableText?: (key: string, fallback: string) => string;
  onUpdateText?: (key: string, value: string) => void;
}

export default function LinhaDoTempo({
  timeline = [],
  isEditable = false,
  getEditableText,
  onUpdateText
}: LinhaDoTempoProps) {
  if (timeline.length === 0) return null;

  const readText = (key: string, fallback: string) => {
    return getEditableText ? getEditableText(key, fallback) : fallback;
  };

  const saveText = (key: string, value: string) => {
    if (!onUpdateText) return;
    onUpdateText(key, value);
  };

  return (
    <section className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="jornada">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => saveText("timelineLabel", e.currentTarget.textContent || "")}
            className={`font-sans text-accent text-sm font-semibold uppercase tracking-widest ${
              isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
            }`}
          >
            {readText("timelineLabel", "Trajetória")}
          </span>
          <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-4">
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => saveText("timelineTitle", e.currentTarget.textContent || "")}
              className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
            >
              {readText("timelineTitle", "Minha Jornada")}
            </span>
          </h2>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => saveText("timelineDescription", e.currentTarget.textContent || "")}
            className={`font-sans text-text-secondary text-base max-w-[500px] mx-auto ${
              isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded focus:outline-accent" : ""
            }`}
          >
            {readText(
              "timelineDescription",
              "Experiências profissionais e formação ao longo da minha carreira como desenvolvedor."
            )}
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1.5px] bg-border/40 -translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row ${
                    isEven ? "sm:flex-row-reverse" : ""
                  } relative items-stretch`}
                >
                  {/* Marker Dot */}
                  <div className="absolute left-4 sm:left-1/2 size-4 rounded-full bg-accent border-[3px] border-primary -translate-x-1/2 top-4 z-10 shadow-[0_0_8px_rgba(148,255,71,0.5)]" />

                  {/* Left/Right Card Spacer on desktop */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Card Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-full sm:w-[45%] pl-10 sm:pl-0 flex flex-col"
                  >
                    <div
                      className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-6 sm:p-8 rounded-[24px] flex-1 flex flex-col justify-between hover:border-border transition-colors duration-300"
                    >
                      <div>
                        {/* Period & Company */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className="font-sans font-semibold text-accent text-sm tracking-wide">
                            {item.date}
                          </span>
                          <span className="font-sans font-medium text-text-muted text-sm">
                            {item.company}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-sans font-semibold text-text-primary text-xl mb-3">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        {item.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-primary/60 border border-border/20 text-text-secondary font-sans font-semibold text-[11px] px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
