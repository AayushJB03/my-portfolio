"use client"

import { useForm, ValidationError } from "@formspree/react"
import { ArrowRight } from "lucide-react"
import { HeaderTitle } from "./header-title"

const FieldRow = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">{children}</div>
)

const Field = ({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required = true,
  textarea = false,
  half = false,
  errors,
}: {
  id: string
  label: string
  type?: string
  name: string
  placeholder?: string
  required?: boolean
  textarea?: boolean
  half?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any
}) => {
  const borderClass = half
    ? "border-b border-primary/20 sm:last:border-l sm:last:border-l-primary/20"
    : "border-b border-primary/20"

  const inputClass =
    "w-full bg-transparent text-primary/80 text-sm tracking-wide outline-none placeholder:text-primary/60 pt-6 pb-2 resize-none"

  return (
    <div className={`relative px-4 py-0 ${borderClass}`}>
      <div className="flex items-start justify-between pt-4">
        <label
          htmlFor={id}
          className="text-primary/90 pointer-events-none text-[10px] font-semibold tracking-[0.2em] uppercase"
        >
          {label}
        </label>
        {required && (
          <span className="text-primary/30 text-xs leading-none">✦</span>
        )}
      </div>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={2}
          placeholder={placeholder}
          className={`${inputClass} min-h-[48px]`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {errors && (
        <ValidationError
          field={name}
          prefix={label}
          errors={errors}
          className="text-destructive pb-1 text-[10px]"
        />
      )}
    </div>
  )
}

export const Contact = () => {
  const [state, handleSubmit] = useForm("meewzzyn")

  return (
    <section className="w-full">
      <HeaderTitle title="Get in Touch" />

      {state.succeeded ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 py-10 text-center">
          <span className="text-primary/60 font-pixelify text-4xl">✓</span>
          <p className="text-primary/70 text-sm tracking-wide uppercase">
            Message sent — I&apos;ll be in touch soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          {/* Full Name — full width */}
          <Field
            id="name"
            label="Full Name"
            name="name"
            placeholder="John Doe"
          />

          {/* Email + Phone — side by side */}
          <FieldRow>
            <Field
              id="email"
              label="Email"
              type="email"
              name="email"
              placeholder="john@example.com"
              half
              errors={state.errors}
            />
            <Field
              id="phone"
              label="Phone"
              type="tel"
              name="phone"
              placeholder="+1 234 567 8900"
              required={false}
              half
            />
          </FieldRow>

          {/* Message — full width */}
          <Field
            id="message"
            label="Message"
            name="message"
            placeholder="Hey, I'd love to connect!"
            textarea
            errors={state.errors}
          />

          {/* Submit row */}
          <div className="flex items-center justify-end px-4 py-4">
            <button
              type="submit"
              disabled={state.submitting}
              aria-label="Send message"
              className="text-primary/50 hover:text-primary disabled:text-primary/20 group cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <ArrowRight className="size-6 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
