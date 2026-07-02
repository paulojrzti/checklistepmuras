"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Check, Play, CircleCheck } from "lucide-react";
import { trainingLessons } from "../../../data/training";
import { useTrainingStore } from "../../../store/useTrainingStore";
import { BonusBadge, VideoEmbed } from "../../../components/bonus/BonusComponents";

export default function TreinamentoPage() {
  const [mounted, setMounted] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(trainingLessons[0].id);
  const { watchedLessons, toggleWatched, markWatched } = useTrainingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeLessonId]);

  if (!mounted) return <div className="p-8 text-center text-brand-gray">Carregando treinamento...</div>;

  const activeLesson = trainingLessons.find(l => l.id === activeLessonId) ?? trainingLessons[0];
  const activeIndex = trainingLessons.findIndex(l => l.id === activeLesson.id);
  const watchedCount = trainingLessons.filter(l => watchedLessons.includes(l.id)).length;
  const percent = Math.round((watchedCount / trainingLessons.length) * 100);

  const openLesson = (id: string) => {
    setActiveLessonId(id);
    markWatched(id);
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-brand-dark-green text-brand-beige p-3 rounded-xl shadow-md">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-green">Mini Treinamento EPMURAS</h1>
          <p className="text-brand-gray text-sm mt-0.5">Como usar o sistema na prática, etapa por etapa</p>
        </div>
        <BonusBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Player + current lesson */}
        <div className="space-y-4 min-w-0">
          <VideoEmbed youtubeId={activeLesson.youtubeId} title={activeLesson.title} />

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Aula {activeIndex + 1} de {trainingLessons.length}
            </p>
            <h2 className="font-display text-xl font-bold text-brand-dark-green mt-1">{activeLesson.title}</h2>
            <p className="text-sm text-brand-gray mt-2 leading-relaxed">{activeLesson.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => toggleWatched(activeLesson.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  watchedLessons.includes(activeLesson.id)
                    ? 'bg-green-100 text-brand-green'
                    : 'bg-brand-beige text-brand-dark-green hover:bg-brand-gold/20'
                }`}
              >
                <CircleCheck className="h-4 w-4" />
                {watchedLessons.includes(activeLesson.id) ? 'Aula concluída' : 'Marcar como concluída'}
              </button>
              {activeIndex < trainingLessons.length - 1 && (
                <button
                  type="button"
                  onClick={() => openLesson(trainingLessons[activeIndex + 1].id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-dark-green text-white px-4 py-2 text-sm font-semibold hover:bg-brand-deep-green transition-colors shadow-sm"
                >
                  Próxima aula
                  <Play className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <aside className="space-y-4">
          {/* Course progress */}
          <div className="rounded-2xl bg-brand-dark-green text-white p-5 shadow-lg shadow-brand-dark-green/20">
            <h3 className="font-bold text-brand-beige">Seu Progresso</h3>
            <p className="text-2xl font-bold mt-2">
              {watchedCount}<span className="text-base font-normal opacity-80"> de {trainingLessons.length} aulas</span>
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-brand-green to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <ol className="rounded-2xl bg-white border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {trainingLessons.map((lesson, i) => {
              const watched = watchedLessons.includes(lesson.id);
              const active = lesson.id === activeLesson.id;
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => openLesson(lesson.id)}
                    className={`flex items-center gap-3 w-full p-3.5 text-left transition-colors ${
                      active ? 'bg-brand-beige/80' : 'hover:bg-brand-beige/50'
                    }`}
                  >
                    <span
                      className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        watched
                          ? 'bg-brand-green text-white'
                          : active
                            ? 'bg-brand-dark-green text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {watched ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm leading-tight ${active ? 'font-bold text-brand-dark-green' : 'font-semibold text-brand-gray'}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration && <span className="block text-xs text-brand-gray/60 mt-0.5">{lesson.duration}</span>}
                    </span>
                    {active && <Play className="h-4 w-4 text-brand-gold ml-auto shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
