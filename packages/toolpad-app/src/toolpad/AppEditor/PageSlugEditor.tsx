import { Autocomplete, TextField } from '@mui/material';
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
  const [pageSlugInput, setPageSlugInput] = React.useState(node.attributes.slug);
  const domApi = useDomApi();

  const handlePageSlugChange = React.useCallback(
    (value: string[]) => {
      setPageSlugInput(value);
      domApi.update((appDom: AppDom) =>
        setNodeNamespacedProp(appDom, node, 'attributes', 'slug', value),
      );
    },
    [node, domApi],
  );

  return (
    <Autocomplete
      multiple
      limitTags={2}
      freeSolo
      fullWidth
      value={pageSlugInput}
      onChange={(_, value) => {
        handlePageSlugChange(value);
      }}
      options={[]}
      renderInput={(params) => (
        <TextField
          error={!pageSlugInput?.join('')}
          helperText={validateInput(pageSlugInput?.join(''))}
          label="Page Slug"
          {...params}
        />
      )}
    />
  );

  // return (
  //   <TextField
  //     fullWidth
  //     label="Page Slug"
  //     value={pageSlugInput}
  //     onChange={handlePageSlugChange}
  //     onBlur={handleCommit}
  //     onKeyDown={handleKeyPress}
  //     error={!pageSlugInput}
  //     helperText={validateInput(pageSlugInput)}
  //   />
  // );
}
