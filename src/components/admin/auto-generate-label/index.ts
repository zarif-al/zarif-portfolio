import type {
  CustomComponent,
  TextFieldLabelClientComponent,
  TextareaFieldLabelClientComponent,
} from 'payload'
import type { IAutoGenerateLabelProps } from './component'

interface AutoGenerateLabelComponentProps<T> extends IAutoGenerateLabelProps {
  type: T
}

export function AutoGenerateLabelComponent(
  props: AutoGenerateLabelComponentProps<'text'>,
): CustomComponent<TextFieldLabelClientComponent>

export function AutoGenerateLabelComponent(
  props: AutoGenerateLabelComponentProps<'textarea'>,
): CustomComponent<TextareaFieldLabelClientComponent>

export function AutoGenerateLabelComponent({
  sourcePath,
  contentType,
  labelOverride,
}: AutoGenerateLabelComponentProps<'text' | 'textarea'>) {
  return {
    path: '@/components/admin/auto-generate-label/component',
    exportName: 'AutoGenerateLabel',
    clientProps: {
      sourcePath,
      contentType,
      labelOverride,
    },
  }
}
