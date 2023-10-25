import * as React from 'react';
import * as appDom from '../../../appDom';

export function useNodeNameValidation(name: string, disallowedNames: Set<string>, kind: string) {
  return React.useMemo(
    () => appDom.validateNodeName(name, disallowedNames, kind),
    [name, disallowedNames, kind],
  );
}
export function useNodeSlugValidation(slugs: string[], disallowedNames: Set<string>, kind: string) {
  return React.useMemo(
    () => appDom.validateNodeSlug(slugs, disallowedNames, kind),
    [slugs, disallowedNames, kind],
  );
}
