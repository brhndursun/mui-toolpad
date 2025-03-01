import * as React from 'react';
import MarkdownDocs from '@mui/monorepo/docs/src/modules/components/MarkdownDocs';
import * as pageProps from '../../../../data/toolpad/reference/api/create-handler.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
