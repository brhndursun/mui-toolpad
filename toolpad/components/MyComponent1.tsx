import * as React from 'react';
import { Typography } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface MyComponent1Props {
  msg: string;
}

export const iconName = 'AutoMode';

function MyComponent1({ msg }: MyComponent1Props) {
  return <Typography>{msg}</Typography>;
}

export default createComponent(MyComponent1, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello world!',
    },
  },
});
