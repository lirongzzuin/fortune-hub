'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentEntry, InputField } from '@/engine/types';

interface InputFormProps {
  content: ContentEntry;
}

export default function InputForm({ content }: InputFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    content.inputSchema.forEach((field) => {
      if (field.required && !values[field.key]?.trim()) {
        newErrors[field.key] = `${field.label}을(를) 입력해주세요.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to result page with params
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    router.push(`/r/${content.slug}?${params.toString()}`);
  };

  const renderField = (field: InputField) => {
    switch (field.type) {
      case 'date':
        return (
          <input
            type="date"
            value={values[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
            placeholder={field.placeholder}
            max={new Date().toISOString().split('T')[0]}
          />
        );
      case 'text':
        return (
          <input
            type="text"
            value={values[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
            placeholder={field.placeholder}
            maxLength={20}
          />
        );
      case 'select':
        return (
          <select
            value={values[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
          >
            <option value="">선택하세요</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={values[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
            placeholder={field.placeholder}
          />
        );
    }
  };

  if (content.inputSchema.length === 0) {
    // 입력 없이 바로 시작 (테스트/퀴즈/게임)
    return (
      <div className="mt-6">
        <button
          onClick={() => router.push(`/r/${content.slug}`)}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          시작하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {content.inputSchema.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {renderField(field)}
          {errors[field.key] && (
            <p className="mt-1 text-xs text-red-400">{errors[field.key]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity active:scale-[0.98] mt-6"
      >
        결과 보기
      </button>
    </form>
  );
}
