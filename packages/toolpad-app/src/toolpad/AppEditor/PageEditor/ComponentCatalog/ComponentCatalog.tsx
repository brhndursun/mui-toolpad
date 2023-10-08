import * as React from 'react';
import {
  Box,
  Collapse,
  darken,
  IconButton,
  Link,
  styled,
  Typography,
  TextField,
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import invariant from 'invariant';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/Search';
import { uncapitalize } from '@mui/toolpad-utils/strings';
import ComponentCatalogItem from './ComponentCatalogItem';
import CreateCodeComponentNodeDialog from '../../PagesExplorer/CreateCodeComponentNodeDialog';
import * as appDom from '../../../../appDom';
import { useAppState } from '../../../AppState';
import { usePageEditorApi } from '../PageEditorProvider';
import { useToolpadComponents } from '../../toolpadComponents';
import useLocalStorageState from '../../../../utils/useLocalStorageState';
import HelpTooltipIcon from '../../../../components/HelpTooltipIcon';

const WIDTH_COLLAPSED = 40;

const ComponentCatalogRoot = styled('div')({
  position: 'relative',
  width: WIDTH_COLLAPSED + 1,
  height: '100%',
  zIndex: 1,
  overflow: 'visible',
});

export interface ComponentCatalogProps {
  className?: string;
}

export default function ComponentCatalog({ className }: ComponentCatalogProps) {
  const api = usePageEditorApi();
  const { dom } = useAppState();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [openStart, setOpenStart] = React.useState(0);
  const [openGroupComponents, setOpenGroupComponents] = useLocalStorageState(
    'catalog-group-expanded',
    {} as any,
  );

  const closeTimeoutRef = React.useRef<NodeJS.Timeout>();
  const openDrawer = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setOpenStart(Date.now());
  }, []);

  const closeDrawer = React.useCallback(
    (delay?: number) => {
      const timeOpen = Date.now() - openStart;
      const defaultDelay = timeOpen > 750 ? 500 : 0;
      closeTimeoutRef.current = setTimeout(() => {
        setOpenStart(0);
      }, delay ?? defaultDelay);
    },
    [openStart, setOpenStart],
  );

  const toolpadComponents = useToolpadComponents(dom);

  const handleDragStart = (componentType: string) => (event: React.DragEvent<HTMLElement>) => {
    const def = toolpadComponents[componentType];
    invariant(def, `No component definition found for "${componentType}"`);

    event.dataTransfer.dropEffect = 'copy';
    const newNode = appDom.createElement(
      dom,
      def.builtIn || componentType,
      def.initialProps || {},
      undefined,
      uncapitalize(def.displayName),
    );
    api.newNodeDragStart(newNode);
    closeDrawer(0);
  };

  const handleMouseEnter = React.useCallback(() => openDrawer(), [openDrawer]);
  const handleMouseLeave = React.useCallback(() => closeDrawer(), [closeDrawer]);

  const [createCodeComponentDialogOpen, setCreateCodeComponentDialogOpen] = React.useState(false);

  const handleCreateCodeComponentDialogOpen = React.useCallback(() => {
    setCreateCodeComponentDialogOpen(true);
    closeDrawer(0);
  }, [closeDrawer]);
  const handleCreateCodeComponentDialogClose = React.useCallback(
    () => setCreateCodeComponentDialogOpen(false),
    [],
  );

  const sortedData = React.useMemo(
    () =>
      Object.entries(toolpadComponents).sort(([nameA, componentA], [nameB, componentB]) => {
        const groupComparison = componentA?.group.localeCompare(componentB?.group || '');
        if (groupComparison === 0) {
          return nameA.localeCompare(nameB);
        }
        return groupComparison || 0;
      }),
    [toolpadComponents],
  );

  const filteredItems = React.useMemo(() => {
    const entries = sortedData;

    if (!searchTerm) {
      return entries;
    }
    const regex = new RegExp(searchTerm.split('').join('.*'), 'i');
    return entries.filter(
      ([componentName, component]) =>
        regex.test(componentName) || component?.synonyms.some((name) => regex.test(name)),
    );
  }, [sortedData, searchTerm]);

  const drawerOpen = !!openStart || searchFocused;

  React.useEffect(() => {
    if (!drawerOpen) {
      setSearchTerm('');
    }
  }, [drawerOpen]);

  return (
    <React.Fragment>
      <ComponentCatalogRoot
        data-testid="component-catalog"
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
            bottom: 0,
            backgroundColor: 'background.default',
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          <Collapse
            in={drawerOpen}
            orientation="horizontal"
            timeout={200}
            sx={{
              height: '100%',
              justifyContent: 'flex-end',
              display: 'flex',
            }}
          >
            <Box sx={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
              <Box
                sx={{
                  width: '100%',
                  pl: 1,
                  pr: 1,
                }}
              >
                <TextField
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  width: 250,
                  overflow: 'auto',
                  scrollbarGutter: 'stable',
                }}
              >
                {[...new Set(filteredItems.map((item) => item[1]?.group || ''))]
                  .filter((group) => group)
                  .map((group) => {
                    return (
                      <React.Fragment key={group}>
                        <Box
                          pl={2}
                          pr={1.5}
                          pb={0}
                          display="flex"
                          flexDirection={'row'}
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center">
                            <Typography mr={0.5} variant="overline">
                              {group.toUpperCase()}
                            </Typography>
                          </Box>
                          <IconButton
                            aria-label="Expand custom components"
                            sx={{
                              p: 0,
                              height: '100%',
                              alignSelf: 'center',
                              cursor: 'pointer',
                              transform: `rotate(${openGroupComponents[group] ? 180 : 0}deg)`,
                              transition: 'all 0.2s ease-in',
                            }}
                            onClick={() =>
                              setOpenGroupComponents((prev: any) => ({
                                ...prev,
                                [group]: !prev[group],
                              }))
                            }
                          >
                            <ArrowDropDownSharpIcon />
                          </IconButton>
                        </Box>
                        <Collapse in={openGroupComponents[group]} orientation={'vertical'}>
                          <Box
                            display="grid"
                            gridTemplateColumns="1fr 1fr 1fr"
                            gap={1}
                            padding={1}
                            pt={0}
                          >
                            {filteredItems
                              .filter((item) => item[1]?.group === group)
                              .map(([componentId, componentType]) => {
                                invariant(
                                  componentType,
                                  `No component definition found for "${componentId}"`,
                                );
                                return componentType.builtIn && !componentType.system ? (
                                  <ComponentCatalogItem
                                    key={componentId}
                                    id={componentId}
                                    draggable
                                    onDragStart={handleDragStart(componentId)}
                                    displayName={componentType.displayName}
                                    builtIn={componentType.builtIn}
                                    kind={'builtIn'}
                                  />
                                ) : null;
                              })}
                          </Box>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}

                <Box
                  pl={2}
                  pr={1.5}
                  pb={0}
                  display="flex"
                  flexDirection={'row'}
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Typography mr={0.5} variant="overline">
                      Custom Components
                    </Typography>
                    <HelpTooltipIcon
                      helpText={
                        <Typography variant="inherit">
                          Expand Toolpad with your own React components.{' '}
                          <Link
                            href="https://mui.com/toolpad/concepts/custom-components"
                            target="_blank"
                            rel="noopener"
                          >
                            Learn more
                          </Link>
                          .
                        </Typography>
                      }
                    />
                  </Box>
                  <IconButton
                    aria-label="Expand custom components"
                    sx={{
                      p: 0,
                      height: '100%',
                      alignSelf: 'center',
                      cursor: 'pointer',
                      transform: `rotate(${openGroupComponents.custom ? 180 : 0}deg)`,
                      transition: 'all 0.2s ease-in',
                    }}
                    onClick={() =>
                      setOpenGroupComponents((prev: any) => ({
                        ...prev,
                        custom: !prev.custom,
                      }))
                    }
                  >
                    <ArrowDropDownSharpIcon />
                  </IconButton>
                </Box>
                <Collapse in={openGroupComponents.custom} orientation={'vertical'}>
                  <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={1} padding={1} pt={0}>
                    {filteredItems.map(([componentId, componentType]) => {
                      invariant(
                        componentType,
                        `No component definition found for "${componentId}"`,
                      );
                      return !componentType.builtIn ? (
                        <ComponentCatalogItem
                          key={componentId}
                          id={componentId}
                          draggable
                          onDragStart={handleDragStart(componentId)}
                          displayName={componentType.displayName}
                          kind={'custom'}
                        />
                      ) : null;
                    })}
                    <ComponentCatalogItem
                      id="CreateNew"
                      displayName="Create"
                      kind="create"
                      onClick={handleCreateCodeComponentDialogOpen}
                    />
                  </Box>
                </Collapse>
              </Box>
            </Box>
          </Collapse>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: WIDTH_COLLAPSED,
            }}
          >
            <Box sx={{ mt: 2 }}>{openStart ? <ArrowLeftIcon /> : <ArrowRightIcon />}</Box>
            <Box position="relative">
              <Typography
                sx={{
                  position: 'absolute',
                  top: 0,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 20,
                  transform: 'rotate(90deg) translate(-10px, 0)',
                  transformOrigin: '0 50%',
                  whiteSpace: 'nowrap',
                }}
              >
                Component library
              </Typography>
            </Box>
          </Box>
        </Box>
      </ComponentCatalogRoot>
      <CreateCodeComponentNodeDialog
        open={!!createCodeComponentDialogOpen}
        onClose={handleCreateCodeComponentDialogClose}
      />
    </React.Fragment>
  );
}
