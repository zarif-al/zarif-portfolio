import type { Block } from 'payload'

export const TerminalBlock: Block = {
  slug: 'terminal-block',
  interfaceName: 'TerminalBlockBlock',
  fields: [
    {
      name: 'lines',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Command', value: 'command' },
            { label: 'Output', value: 'output' },
          ],
          required: true,
          defaultValue: 'command',
        },
        {
          name: 'command',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'command' },
        },
        {
          name: 'output',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'output' },
        },
        { name: 'indent', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'systemNodes',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'nowPlaying',
      type: 'group',
      fields: [{ name: 'track', type: 'text', required: true }],
    },
  ],
}
