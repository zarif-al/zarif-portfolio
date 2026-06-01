'use client'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from '@/utilities/cn'
import { submitContact } from './contact-form-action'

const RESET_DELAY_MS = 5_000

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>()

  const [status, setStatus] = useState<SubmissionStatus>('idle')

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setStatus('sending')
      try {
        await submitContact(data)
        setStatus('success')
        setTimeout(() => {
          reset()
          setStatus('idle')
        }, RESET_DELAY_MS)
      } catch {
        setStatus('error')
      }
    },
    [reset],
  )

  return (
    <form noValidate className="bg-surface p-7" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Name" error={errors.name?.message}>
        <input
          type="text"
          placeholder="Your name"
          disabled={status === 'sending' || status === 'success'}
          className={inputClass(errors.name)}
          {...register('name', { required: 'Please enter your name.' })}
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          placeholder="you@example.com"
          disabled={status === 'sending' || status === 'success'}
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
          disabled={status === 'sending' || status === 'success'}
          className={cn(inputClass(errors.message), 'resize-y min-h-[7rem]')}
          {...register('message', { required: 'Please include a message.' })}
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'sending' || status === 'success'}
        className="bg-fg text-bg border-0 px-6 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="font-display text-[1.1rem] italic text-accent mt-4">
          Thanks — message sent. I&apos;ll get back to you.
        </p>
      )}

      {status === 'error' && (
        <p className="font-mono text-[0.72rem] text-error mt-4">
          Something went wrong. Please try again.
        </p>
      )}
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
    'disabled:opacity-60 disabled:cursor-not-allowed',
    error && 'border-error',
  )
}
