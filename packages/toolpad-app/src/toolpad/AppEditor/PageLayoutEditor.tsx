import { MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import * as React from 'react';
import { AppDom, PageLayoutMode, PageNode, setNodeNamespacedProp } from '../../appDom';
import { useDomApi } from '../AppState';

interface PageLayoutEditorProps {
  node: PageNode;
}

const PAGE_LAYOUT_OPTIONS: { value: PageLayoutMode; label: string }[] = [
  { value: 'container', label: 'Container' },
  { value: 'fluid', label: 'Fluid' },
];

export default function PageLayoutEditor({ node }: PageLayoutEditorProps) {
  const domApi = useDomApi();
  const [pageLayoutInput, setpageLayoutInput] = React.useState(node.attributes.layout);

  const handlePageLayoutChange = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, newValue: PageLayoutMode) => {
      setpageLayoutInput(newValue);
      domApi.update((appDom: AppDom) =>
        setNodeNamespacedProp(appDom, node, 'attributes', 'layout', newValue),
      );
    },
    [domApi, node],
  );

  return (
    <React.Fragment>
      <Typography variant="body2">Page Layout:</Typography>
      <ToggleButtonGroup
        exclusive
        defaultValue={'container'}
        value={pageLayoutInput ?? 'container'}
        onChange={handlePageLayoutChange}
        aria-label="Page Layout"
        fullWidth
      >
        {PAGE_LAYOUT_OPTIONS.map((option) => {
          return (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </React.Fragment>
  );
}
