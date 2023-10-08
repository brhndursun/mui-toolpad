import * as React from 'react';
import { Typography } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface MyComponent2Props {
  msg: string;
}

export const iconName = 'Face';

function MyComponent2({ msg }: MyComponent2Props) {
  return <Typography>{msg}</Typography>;
}

export default createComponent(MyComponent2, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello worlds!',
    },
  },
});
