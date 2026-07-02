"use client";

import React from 'react';

const groupThousands = (digits: string) =>
  digits.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Máscara numérica pt-BR aplicada enquanto digita: só aceita dígitos e uma
 * vírgula decimal, agrupa milhares com ponto e limita casas decimais.
 * Ex.: "4500" -> "4.500" | "312,5" -> "312,5" | "abc" -> "".
 */
export const maskNumberBR = (raw: string, decimals: number, max?: number): string => {
  let cleaned = raw.replace(/[^\d,]/g, '');
  if (decimals === 0) cleaned = cleaned.replace(/,/g, '');
  if (!cleaned) return '';

  const commaIndex = cleaned.indexOf(',');
  let intPart = commaIndex === -1 ? cleaned : cleaned.slice(0, commaIndex);
  const decPart = commaIndex === -1 ? null : cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, decimals);
  if (intPart === '') intPart = '0';

  if (max !== undefined) {
    const numeric = parseFloat(`${intPart}.${decPart || '0'}`);
    if (numeric > max) return numberToMaskedString(max, decimals);
  }

  return groupThousands(intPart) + (decPart !== null ? `,${decPart}` : '');
};

/** Converte um número para o formato aceito pela máscara (ex.: 3500.5 -> "3.500,5"). */
export const numberToMaskedString = (n: number, decimals = 2): string =>
  n.toLocaleString('pt-BR', { maximumFractionDigits: decimals });

type MaskedNumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'prefix' | 'type'> & {
  value: string;
  onChange: (value: string) => void;
  /** Casas decimais permitidas (0 = inteiro). */
  decimals?: number;
  /** Valor máximo — digitação acima disso é limitada (ex.: 100 para %). */
  max?: number;
  prefix?: string;
  suffix?: string;
};

export const MaskedNumberInput = ({
  value,
  onChange,
  decimals = 0,
  max,
  prefix,
  suffix,
  className = '',
  ...props
}: MaskedNumberInputProps) => (
  <div
    className={`flex items-center gap-2 w-full p-2.5 border border-gray-300 rounded-lg bg-white shadow-sm transition-colors focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold ${className}`}
  >
    {prefix && <span className="text-sm font-semibold text-brand-gray/50 shrink-0 select-none">{prefix}</span>}
    <input
      type="text"
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      autoComplete="off"
      className="w-full min-w-0 bg-transparent outline-none text-brand-gray placeholder:text-gray-400"
      value={maskNumberBR(value, decimals, max)}
      onChange={e => onChange(maskNumberBR(e.target.value, decimals, max))}
      {...props}
    />
    {suffix && <span className="text-sm font-semibold text-brand-gray/50 shrink-0 select-none">{suffix}</span>}
  </div>
);
