import { Typography as MuiTypography } from '@mui/material';
import * as React from 'react';
import createBuiltin from './createBuiltin';

function parseInput(text: unknown): string {
  return String(text).replaceAll('\n', '');
}
interface TextContentProps {
  value: string;
}

function TextContent({ value }: TextContentProps) {
  const [input, setInput] = React.useState<string>(parseInput(value));
  React.useEffect(() => {
    setInput(parseInput(value));
  }, [value]);

  return (
    <MuiTypography
      sx={{
        // This will give it height, even when empty.
        // REMARK: Does it make sense to put it in MUI core?
        [`&:empty::before`]: { content: '""', display: 'inline-block' },
        outline: 'none',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      }}
    >
      {input}
    </MuiTypography>
  );
}

export default createBuiltin(TextContent, {
  helperText: 'The Page Renderer component lets you display pages in page.',
  layoutDirection: 'both',
  argTypes: {
    value: {
      helperText: 'The text content.',
      type: 'string',
      default: 'text',
      label: 'Value',
      control: { type: 'string' },
    },
  },
});
