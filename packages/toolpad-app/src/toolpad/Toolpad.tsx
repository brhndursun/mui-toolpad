import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SyncIcon from '@mui/icons-material/Sync';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  CssBaseline,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  styled,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { GLOBAL_FUNCTIONS_FEATURE_FLAG } from '../constants';
import { ProjectProvider } from '../project';
import { APP_FUNCTIONS_ROUTE } from '../routes';
import { getViewFromPathname } from '../utils/domView';
import useMenu from '../utils/useMenu';
import AppEditor from './AppEditor';
import ErrorAlert from './AppEditor/PageEditor/ErrorAlert';
import AppProvider, { AppState, useAppStateContext } from './AppState';
import ToolpadShell from './ToolpadShell';

const Centered = styled('div')({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function FullPageLoader() {
  return (
    <Centered>
      <CircularProgress />
    </Centered>
  );
}

interface FullPageErrorProps {
  error: Error;
}

function FullPageError({ error }: FullPageErrorProps) {
  return (
    <Centered sx={{ p: 4 }}>
      <ErrorAlert sx={{ width: '100%' }} error={error} />
    </Centered>
  );
}

function ErrorFallback({ error }: FallbackProps) {
  return <FullPageError error={error} />;
}

function getAppSaveState(appState: AppState): React.ReactNode {
  if (appState.saveDomError) {
    return (
      <Tooltip title="Error while saving">
        <SyncProblemIcon color="primary" />
      </Tooltip>
    );
  }

  const isSaving = appState.unsavedDomChanges > 0;

  if (isSaving) {
    return (
      <Tooltip title="Saving changes…">
        <SyncIcon color="primary" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="All changes saved!">
      <CloudDoneIcon color="primary" />
    </Tooltip>
  );
}

export interface EditorShellProps {
  children: React.ReactNode;
}

function EditorShell({ children }: EditorShellProps) {
  const appState = useAppStateContext();

  const location = useLocation();

  const { buttonProps, menuProps, onMenuClose } = useMenu();

  const shellProps = React.useMemo(() => {
    const currentView = getViewFromPathname(location.pathname);

    if (currentView) {
      const currentPageId = currentView?.kind === 'page' ? currentView.nodeId : null;

      const previewPath = currentPageId ? `${appState.appUrl}/${currentPageId}` : appState.appUrl;

      return {
        actions: (
          <React.Fragment>
            <Stack direction="row" gap={1} alignItems="center">
              <ButtonGroup>
                <Button
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  color="primary"
                  component="a"
                  href={previewPath}
                  target="_blank"
                >
                  Preview
                </Button>
                <Button size="small" {...buttonProps}>
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
            </Stack>

            <Menu {...menuProps}>
              <MenuItem
                onClick={(event) => {
                  // onChange(event, option.value);
                  onMenuClose();
                }}
              >
                <ListItemText primary={'Yapım aşamasında'} />
              </MenuItem>
            </Menu>
          </React.Fragment>
        ),
        status: getAppSaveState(appState),
      };
    }

    return {};
  }, [appState, location.pathname, buttonProps, menuProps, onMenuClose]);

  return <ToolpadShell {...shellProps}>{children}</ToolpadShell>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

export interface ToolpadProps {
  basename: string;
  appUrl: string;
}

export default function Toolpad({ appUrl, basename }: ToolpadProps) {
  return (
    <ThemeProvider>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {/* Container that allows children to size to it with height: 100% */}
      <Box sx={{ height: '1px', minHeight: '100vh' }}>
        <ErrorBoundary fallbackRender={ErrorFallback}>
          <React.Suspense fallback={<FullPageLoader />}>
            <QueryClientProvider client={queryClient}>
              <ProjectProvider url={appUrl}>
                <BrowserRouter basename={basename}>
                  <AppProvider appUrl={appUrl}>
                    <EditorShell>
                      <Routes>
                        {GLOBAL_FUNCTIONS_FEATURE_FLAG ? (
                          <Route path={APP_FUNCTIONS_ROUTE} element={<div />} />
                        ) : null}
                        <Route path="/*" element={<AppEditor />} />
                      </Routes>
                    </EditorShell>
                  </AppProvider>
                </BrowserRouter>
              </ProjectProvider>
            </QueryClientProvider>
          </React.Suspense>
        </ErrorBoundary>
      </Box>
    </ThemeProvider>
  );
}
