import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import * as React from 'react';
import invariant from 'invariant';
import useEventCallback from '@mui/utils/useEventCallback';
import * as appDom from '../../../appDom';
import DialogForm from '../../../components/DialogForm';
import { useAppStateApi, useAppState } from '../../AppState';
import { useNodeNameValidation, useNodeSlugValidation } from './validation';

const DEFAULT_NAME = 'page';
const DEFAULT_SLUG = ['page'];

export interface CreatePageDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePageDialog({ open, onClose, ...props }: CreatePageDialogProps) {
  const { dom } = useAppState();
  const appStateApi = useAppStateApi();

  const existingNames = React.useMemo(
    () => appDom.getExistingNamesForChildren(dom, appDom.getApp(dom), 'pages'),
    [dom],
  );
  const existingSlugs = React.useMemo(
    () => appDom.getExistingNamesForChildren(dom, appDom.getApp(dom), 'pages', 'slug'),
    [dom],
  );

  const [name, setName] = React.useState(appDom.proposeName(DEFAULT_NAME, existingNames));
  const [slug, setSlug] = React.useState(DEFAULT_SLUG);

  // Reset form
  const handleReset = useEventCallback(() =>
    setName(appDom.proposeName(DEFAULT_NAME, existingNames)),
  );

  React.useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open, handleReset]);

  const inputErrorMsg = useNodeNameValidation(name, existingNames, 'page');
  const inputSlugErrorMsg = useNodeSlugValidation(slug, existingSlugs, 'page');
  const isNameValid = !inputErrorMsg;
  const isSlugValid = !inputSlugErrorMsg;
  const isFormValid = isNameValid && isSlugValid;

  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <DialogForm
        autoComplete="off"
        onSubmit={(event) => {
          invariant(isFormValid, 'Invalid form should not be submitted when submit is disabled');

          event.preventDefault();
          const newNode = appDom.createNode(dom, 'page', {
            name,
            attributes: {
              title: name,
              display: 'standalone',
              layout: 'fluid',
              slug,
            },
          });
          const appNode = appDom.getApp(dom);

          appStateApi.update((draft) => appDom.addNode(draft, newNode, appNode, 'pages'), {
            kind: 'page',
            nodeId: newNode.id,
          });

          onClose();
        }}
      >
        <DialogTitle>Create a new Page</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ my: 1 }}
            required
            autoFocus
            fullWidth
            label="Page Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={!isNameValid}
            helperText={inputErrorMsg}
          />
          <Autocomplete
            multiple
            limitTags={2}
            freeSolo
            sx={{ my: 1 }}
            fullWidth
            value={slug}
            onChange={(_, value) => {
              setSlug(value);
            }}
            options={[]}
            renderInput={(params) => (
              <TextField
                error={!isSlugValid}
                helperText={inputSlugErrorMsg}
                label="Page Slug"
                {...params}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            Create
          </Button>
        </DialogActions>
      </DialogForm>
    </Dialog>
  );
}
