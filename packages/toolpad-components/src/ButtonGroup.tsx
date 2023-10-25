import * as React from 'react';
import {
  ButtonGroup as MuiButtonGroup,
  ButtonGroupProps as MuiButtonGroupProps,
} from '@mui/material';
import createBuiltin from './createBuiltin';
import { SX_PROP_HELPER_TEXT } from './constants';

export const ButtonContext = React.createContext<{
  group: ReturnType<typeof Boolean> | null;
  groupProps: Record<string, any>;
}>({
  group: null,
  groupProps: {},
});

export function withComponentButton<P extends Record<string, any>>(
  ButtonComponent: React.ComponentType<P>,
) {
  return function ComponentWithButton(props: P) {
    const { group, groupProps } = React.useContext(ButtonContext);
    const buttonGroupElement = <ButtonComponent {...props} {...groupProps} />;
    const buttonElement = <ButtonComponent {...props} />;
    return group ? buttonGroupElement : buttonElement;
  };
}

interface ButtonGroupProps extends MuiButtonGroupProps {
  parentId: any;
  __toolpadSlots: any;
}

function ButtonGroup({ children, parentId, __toolpadSlots, ...props }: ButtonGroupProps) {
  const groupContextValue = React.useMemo(() => ({ group: true, groupProps: props }), [props]);

  return (
    <ButtonContext.Provider value={groupContextValue}>
      <MuiButtonGroup {...props}>{children}</MuiButtonGroup>
    </ButtonContext.Provider>
  );
}

export default createBuiltin(ButtonGroup, {
  helperText:
    'The Material UI [Button Group](https://mui.com/material-ui/react-button-group/) component.',
  layoutDirection: 'both',
  argTypes: {
    children: {
      helperText: 'The content of the component.',
      type: 'element',
      control: { type: 'buttons' },
    },
    variant: {
      helperText:
        'One of the available Material UI Button [variants](https://mui.com/material-ui/react-button/#basic-button). Possible values are `contained`, `outlined` or `text`',
      type: 'string',
      enum: ['contained', 'outlined', 'text'],
      default: 'contained',
    },
    size: {
      helperText: 'The size of the component. One of `small`, `medium`, or `large`.',
      type: 'string',
      enum: ['small', 'medium', 'large'],
      default: 'small',
    },
    color: {
      helperText: 'The theme color of the component.',
      type: 'string',
      enum: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
      default: 'primary',
    },
    fullWidth: {
      helperText: 'Whether the button should occupy all available horizontal space.',
      type: 'boolean',
    },
    orientation: {
      helperText: "Displays a loading animation indicating the button isn't interactive yet",
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    disabled: {
      helperText: 'Whether the button is disabled.',
      type: 'boolean',
    },
    disableElevation: {
      helperText: 'Whether the button is flatten.',
      type: 'boolean',
    },
    sx: {
      helperText: SX_PROP_HELPER_TEXT,
      type: 'object',
    },
  },
});
