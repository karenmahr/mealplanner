'use client';

import { useState } from 'react';

import type { RecipeInput } from '@/types';

type RecipeFormProps = {
  initialValues?: RecipeInput;
  mode: 'create' | 'edit';
};

const emptyRecipe: RecipeInput = {
  title: '',
  description: '',
  imageUrl: '',
  instructions: '',
  prepTimeMinutes: 30,
};

export default function RecipeForm({ initialValues, mode }: RecipeFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const values = initialValues ?? emptyRecipe;
  const submitLabel = mode === 'create' ? 'Create recipe' : 'Save changes';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <form
      className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={handleSubmit}
    >
      <div>
        <h1 className="font-display text-3xl font-bold text-[#1F2937]">
          {mode === 'create' ? 'Create a recipe' : 'Edit recipe'}
        </h1>
        <p className="mt-2 text-slate-600">
          Add the details needed to make this recipe again.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Recipe title"
          name="title"
          required
          defaultValue={values.title}
        />
        <Field
          label="Preparation time (minutes)"
          min="1"
          name="prepTimeMinutes"
          required
          type="number"
          defaultValue={values.prepTimeMinutes}
        />
      </div>

      <Field
        label="Short description"
        name="description"
        required
        defaultValue={values.description}
      />
      <Field
        label="Image URL"
        name="imageUrl"
        type="url"
        defaultValue={values.imageUrl}
        helpText="Optional for now. Images will be managed more fully in a later iteration."
      />
      <Field
        label="Instructions"
        name="instructions"
        required
        defaultValue={values.instructions}
        multiline
      />

      {isSubmitted ? (
        <p
          aria-live="polite"
          className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900"
        >
          The form is ready. Saving will be connected to Neon PostgreSQL in the
          database integration task.
        </p>
      ) : null}

      <button
        className="rounded-lg bg-[#2E6F40] px-5 py-3 font-semibold text-white transition hover:bg-[#245a33] focus:outline-none focus:ring-2 focus:ring-[#2E6F40] focus:ring-offset-2"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}

type FieldProps = {
  defaultValue?: number | string;
  helpText?: string;
  label: string;
  min?: string;
  multiline?: boolean;
  name: string;
  required?: boolean;
  type?: 'number' | 'text' | 'url';
};

function Field({
  defaultValue,
  helpText,
  label,
  min,
  multiline = false,
  name,
  required = false,
  type = 'text',
}: FieldProps) {
  const fieldId = `recipe-${name}`;
  const className =
    'mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2E6F40] focus:ring-2 focus:ring-[#2E6F40]/20';

  return (
    <div>
      <label className="font-semibold text-[#1F2937]" htmlFor={fieldId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {multiline ? (
        <textarea
          className={`${className} min-h-40 resize-y`}
          defaultValue={String(defaultValue ?? '')}
          id={fieldId}
          name={name}
          required={required}
        />
      ) : (
        <input
          className={className}
          defaultValue={defaultValue}
          id={fieldId}
          min={min}
          name={name}
          required={required}
          type={type}
        />
      )}
      {helpText ? (
        <p className="mt-2 text-sm text-slate-500">{helpText}</p>
      ) : null}
    </div>
  );
}
