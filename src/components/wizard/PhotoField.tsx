"use client";

import { useRef, useState } from 'react';
import { Camera, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { compressImageFile } from '../../utils/image';

export const PhotoField = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await compressImageFile(file);
      onChange(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar a foto.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Foto do animal" className="w-full aspect-video object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand-dark-green shadow-md hover:bg-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Trocar
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand-red shadow-md hover:bg-white transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-brand-cream/50 p-6 flex flex-col items-center justify-center gap-2 text-brand-gray/70 hover:border-brand-gold hover:text-brand-brown transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <Camera className="h-7 w-7" />
          )}
          <span className="text-sm font-semibold">
            {loading ? 'Processando foto...' : 'Adicionar foto do animal (opcional)'}
          </span>
          <span className="text-xs">Tire uma foto ou escolha da galeria</span>
        </button>
      )}

      {error && <p className="text-xs text-brand-red font-medium">{error}</p>}
    </div>
  );
};
