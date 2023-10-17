import * as React from 'react';
import { Typography, Button, ButtonGroup } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface Test123Props {
  msg: string;
}

export const iconName = 'DashboardCustomizeSharp';

function test123({ msg }: Test123Props) {
  return (
    <React.Fragment>
      <Typography>{msg}</Typography>
      <ButtonGroup variant="contained">
        <Button>Yapım aşamasında</Button>
      </ButtonGroup>
    </React.Fragment>
  );
}

export default createComponent(test123, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello worlds!',
    },
  },
});
