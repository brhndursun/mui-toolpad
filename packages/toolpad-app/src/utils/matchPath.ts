export function matchPath(pathname: string, route: string) {
  const regex = new RegExp(`^${route.replace(/\//g, '\\/').replace(/:\w+/g, '([^/]+)')}$`);
  const match = pathname.match(regex);
  const params: { [key: string]: string } = {};
  const keys = route.match(/:(\w+)/g);
  if (keys) {
    keys.forEach((key, index) => {
      params[key.slice(1)] = match ? match[index + 1] : '';
    });
  }
  return params;
}

export function findPath(pathname: string, slug: string, fallback: string) {
  const pageId: string | undefined = React.useMemo(() => {
    const slugs = ([] as string[])
      .concat(...pages.map((page) => page.attributes.slug))
      .map((route) => ({ path: route }));
    const [{ route }] = matchRoutes(slugs, location) ?? [{}];
    if (!route?.path) {
      return pageMatch?.params.slug;
    }
    return pages.find((page) => {
      return page.attributes.slug.includes(route.path);
    })?.id;
  }, [location, pages, pageMatch]);
}
