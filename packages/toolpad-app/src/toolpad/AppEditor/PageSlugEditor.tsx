import { TextField } from '@mui/material';
import * as React from 'react';
import { AppDom, PageNode, setNodeNamespacedProp } from '../../appDom';
import { useDomApi } from '../AppState';

interface PageSlugEditorProps {
  node: PageNode;
}

function validateInput(input: string) {
  if (!input) {
    return 'Input required';
  }
  return null;
}

export default function PageSlugEditor({ node }: PageSlugEditorProps) {
  const domApi = useDomApi();
  const [pageSlugInput, setPageSlugInput] = React.useState(node.attributes.slug);

  const handlePageSlugChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setPageSlugInput(event.target.value),
    [],
  );

  const handleCommit = React.useCallback(() => {
    domApi.update((appDom: AppDom) =>
      setNodeNamespacedProp(appDom, node, 'attributes', 'slug', pageSlugInput),
    );
  }, [node, pageSlugInput, domApi]);

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.code === 'Enter') {
        handleCommit();
      }
    },
    [handleCommit],
  );

  return (
    <TextField
      fullWidth
      label="Page Slug"
      value={pageSlugInput}
      onChange={handlePageSlugChange}
      onBlur={handleCommit}
      onKeyDown={handleKeyPress}
      error={!pageSlugInput}
      helperText={validateInput(pageSlugInput)}
    />
  );
}
