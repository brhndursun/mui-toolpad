import * as React from 'react';
import { Rating as MuiRating, RatingProps as MuiRatingProps } from '@mui/lab';
// eslint-disable-next-line no-restricted-imports
import * as iconList from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import createBuiltin from './createBuiltin';
import { SX_PROP_HELPER_TEXT } from './constants';

function Rating({ icon, emptyIcon, ...rest }: MuiRatingProps) {
  const Icon = iconList[icon as keyof typeof iconList];
  const EmptyIcon = iconList[emptyIcon as keyof typeof iconList];

  const MuiIcon = Icon ? <Icon /> : <StarIcon />;
  const MuiEmptyIcon = EmptyIcon ? <EmptyIcon /> : <StarBorderIcon />;

  return <MuiRating icon={MuiIcon} emptyIcon={MuiEmptyIcon} {...rest} />;
}

export default createBuiltin(Rating, {
  helperText:
    'The Material UI [Rating](https://mui.com/material-ui/react-button/) component.\n\nButtons allow users to take actions, and make choices, with a single tap.',
  layoutDirection: 'both',
  argTypes: {
    value: {
      helperText: 'The rating value.',
      type: 'number',
    },
    emptyIcon: {
      helperText: 'The icon to display when empty.',
      type: 'string',
      default: 'StarBorder',
    },
    icon: {
      helperText: 'The icon to display.',
      type: 'string',
      default: 'Star',
    },
    size: {
      helperText: 'The size of the component.',
      type: 'string',
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    precision: {
      helperText: 'The minimum increment value change allowed.',
      type: 'number',
      default: 1,
    },
    max: {
      helperText: 'Maximum rating.',
      type: 'number',
      default: 5,
    },
    highlightSelectedOnly: {
      helperText: 'If `true`, only the selected icon will be highlighted.',
      type: 'boolean',
      default: false,
    },
    readOnly: {
      helperText: 'Removes all hover effects and pointer events.',
      type: 'boolean',
      default: false,
    },
    disabled: {
      helperText: 'If `true`, the component is disabled.',
      type: 'boolean',
      default: false,
    },
    getLabelText: {
      helperText:
        'Accepts a function which returns a string value that provides a user-friendly name for the current value of the rating.',
      type: 'event',
      category: 'events',
    },
    onChange: {
      helperText: 'Callback fired when the value changes.',
      type: 'event',
      category: 'events',
    },
    onChangeActive: {
      helperText: 'Callback function that is fired when the hover state changes.',
      type: 'event',
      category: 'events',
    },
    sx: {
      helperText: SX_PROP_HELPER_TEXT,
      type: 'object',
    },
  },
});
