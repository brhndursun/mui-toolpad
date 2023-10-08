import * as React from 'react';
import { Typography } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface MyComponent3Props {
  msg: string;
}

export const iconName = 'AutoMode';

function MyComponent3({ msg }: MyComponent3Props) {
  return <Typography>{msg}</Typography>;
}

export default createComponent(MyComponent3, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello worlds!',
    },
  },
});
