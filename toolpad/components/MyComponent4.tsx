import * as React from 'react';
import { Typography } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface MyComponent4Props {
  msg: string;
}

function MyComponent4({ msg }: MyComponent4Props) {
  return <Typography>{msg}</Typography>;
}

export default createComponent(MyComponent4, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello world!',
    },
  },
});
