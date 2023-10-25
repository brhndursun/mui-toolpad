import * as React from 'react';
import {
  RadioGroupProps as MuiRadioGroupProps,
  Radio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import createBuiltin from './createBuiltin';
import {
  FORM_INPUT_ARG_TYPES,
  FormInputComponentProps,
  useFormInput,
  withComponentForm,
} from './Form';
import { SX_PROP_HELPER_TEXT } from './constants';

export interface RadioOption {
  value: string;
  label?: string;
}

export type RadioGroupProps = Omit<MuiRadioGroupProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  defaultValue: string;
  options: (string | RadioOption)[];
  orientation: string;
} & Pick<FormInputComponentProps, 'name' | 'isRequired' | 'isInvalid'>;

function RadioGroup({
  options,
  value,
  onChange,
  sx,
  defaultValue,
  isRequired,
  isInvalid,
  orientation,
  ...rest
}: RadioGroupProps) {
  const { onFormInputChange, formInputError, renderFormInput } = useFormInput<string>({
    name: rest.name,
    label: rest.label,
    value,
    onChange,
    defaultValue,
    validationProps: { isRequired, isInvalid },
  });

  const id = React.useId();

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      onFormInputChange(newValue);
    },
    [onFormInputChange],
  );

  const renderedOptions = React.useMemo(
    () =>
      options.map((option, i) => {
        const parsedOption: RadioOption =
          option && typeof option === 'object' ? option : { value: String(option) };
        return (
          <FormControlLabel
            key={parsedOption.value ?? `${id}::${i}`}
            value={parsedOption.value}
            control={<Radio />}
            label={String(parsedOption.label ?? parsedOption.value)}
          />
        );
      }),
    [id, options],
  );

  return renderFormInput(
    <FormControl error={Boolean(formInputError)}>
      <FormLabel>{rest.label}</FormLabel>
      <MuiRadioGroup
        row={orientation === 'horizontal'}
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        {renderedOptions}
      </MuiRadioGroup>
      <FormHelperText>{formInputError?.message || ''}</FormHelperText>
    </FormControl>,
  );
}

const FormWrappedRadio = withComponentForm(RadioGroup);

export default createBuiltin(FormWrappedRadio, {
  helperText:
    'The Material UI [RadioGroup](https://mui.com/material-ui/react-select/) component lets you select a value from a set of options.',
  layoutDirection: 'both',
  loadingPropSource: ['value', 'options'],
  argTypes: {
    options: {
      helperText: 'The available options to select from.',
      type: 'array',
      schema: {
        type: 'array',
        items: {
          type: ['object', 'string'],
          additionalProperties: true,
          properties: {
            value: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
          },
          required: ['value'],
        },
      },
      default: [],
      control: { type: 'SelectOptions' },
    },
    value: {
      helperText: 'The currently selected value.',
      type: 'string',
      default: '',
      onChangeProp: 'onChange',
      defaultValueProp: 'defaultValue',
    },
    defaultValue: {
      helperText: 'A default value.',
      type: 'string',
      default: '',
    },
    orientation: {
      helperText: "Displays a loading animation indicating the button isn't interactive yet",
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    label: {
      helperText: 'A label that describes the option that can be selected. e.g. "Country".',
      type: 'string',
      default: '',
    },
    // size: {
    //   helperText: 'The size of the select. One of `small`, or `medium`.',
    //   type: 'string',
    //   enum: ['small', 'medium'],
    //   default: 'small',
    // },
    // fullWidth: {
    //   helperText: 'Whether the select should occupy all available horizontal space.',
    //   type: 'boolean',
    // },
    // disabled: {
    //   helperText: 'Whether the select is disabled.',
    //   type: 'boolean',
    // },
    ...FORM_INPUT_ARG_TYPES,
    sx: {
      helperText: SX_PROP_HELPER_TEXT,
      type: 'object',
    },
  },
});
