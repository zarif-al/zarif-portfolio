'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import type { FieldLabelClientProps, TextFieldClient } from 'payload'
import type { CSSProperties } from 'react'
import { formatSlug } from '@/utilities/format-slug'

export interface IAutoGenerateLabelProps {
  contentType: 'slug' | 'text'
  labelOverride?: string
  sourcePath?: string
}

type Props = IAutoGenerateLabelProps & FieldLabelClientProps<TextFieldClient>

/**
 * AutoGenerateLabel is a UI component for Payload CMS that provides an "Auto Generate" button
 * for form fields, allowing users to automatically populate a target field's value based on another source field.
 */
export function AutoGenerateLabel({
  htmlFor,
  field,
  path,
  sourcePath,
  labelOverride,
  contentType,
}: Props) {
  const label = labelOverride || field?.label

  const {
    setValue: setTargetValue,
    readOnly: isTargetReadonly,
    formInitializing,
    formProcessing,
  } = useField<string>(path ? { path } : {})

  const { value: sourceValue } = useField<string>({ path: sourcePath ?? '' })

  const labelProps = {
    htmlFor,
    label: label || field?.label,
    path,
    required: field?.required,
  }

  if (!path) {
    return <FieldLabel {...labelProps} />
  }

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
  }

  const spanStyle: CSSProperties = { display: sourceValue ? 'inline' : 'none' }

  const buttonStyle: CSSProperties = {
    cursor: 'pointer',
    borderStyle: 'none',
    backgroundColor: 'transparent',
    padding: '0',
    color: 'currentcolor',
    textDecorationLine: 'underline',
    display: sourceValue ? 'inline' : 'none',
  }

  return (
    <div className="auto-generate-label-wrapper" style={wrapperStyle}>
      <FieldLabel {...labelProps} />

      <span style={spanStyle}>&nbsp; &mdash; &nbsp; </span>

      <button
        style={buttonStyle}
        type="button"
        disabled={isTargetReadonly || formInitializing || formProcessing}
        onClick={() => {
          if (!sourceValue) {
            return
          }

          let newValue: string

          if (contentType === 'slug') {
            newValue = formatSlug(sourceValue)
          } else {
            newValue = sourceValue
          }

          setTargetValue(newValue)
        }}
      >
        Auto Generate
      </button>
    </div>
  )
}
