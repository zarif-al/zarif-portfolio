'use client'

import { useForm } from 'react-hook-form'
import { cn } from '@/utilities/cn'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>()

  if (isSubmitSuccessful) {
    return (
      <div className="font-display text-[1.1rem] italic text-accent py-6">
        Thanks — message sent. I&apos;ll get back to you.
      </div>
    )
  }

  return (
    <form
      noValidate
      className="bg-surface p-7"
      onSubmit={handleSubmit((_data) => {
        // Swallow submission — real backend integration TBD.
      })}
    >
      <Field label="Name" error={errors.name?.message}>
        <input
          type="text"
          placeholder="Your name"
          className={inputClass(errors.name)}
          {...register('name', { required: 'Please enter your name.' })}
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          placeholder="you@example.com"
          className={inputClass(errors.email)}
          {...register('email', {
            required: 'Please enter a valid email.',
            pattern: { value: /.+@.+/, message: 'Please enter a valid email.' },
          })}
        />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          placeholder="What are you working on?"
          rows={5}
          className={cn(inputClass(errors.message), 'resize-y min-h-[7rem]')}
          {...register('message', { required: 'Please include a message.' })}
        />
      </Field>

      <button
        type="submit"
        className="bg-fg text-bg border-0 px-6 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] cursor-pointer transition-opacity duration-200 hover:opacity-85"
      >
        Send Message
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mb-5', error && '[&_input]:border-error [&_textarea]:border-error')}>
      <label className="block font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-[0.4rem] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <span className="block font-mono text-[0.65rem] text-error mt-[0.3rem]">{error}</span>
      )}
    </div>
  )
}

function inputClass(error?: { message?: string }) {
  return cn(
    'w-full border border-border bg-bg text-fg px-3 py-[0.6rem] font-body text-[0.9rem] leading-[1.5] transition-[border-color] duration-200',
    'focus:outline-hidden focus:border-accent',
    error && 'border-error',
  )
}
