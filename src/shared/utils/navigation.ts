export const buildRoute = (
  ...segments: (string | undefined | null | false)[]
): string => {
  return segments
    .filter(Boolean)
    .map((s) => s?.toString().replace(/^\/|\/$/g, "")) // trim leading/trailing slashes
    .join("/");
};

export const navigateTo = (
  navigate: (path: string) => void,
  ...segments: (string | undefined | null | false)[]
) => {
  const path = "/" + buildRoute(...segments);
  navigate(path);
};
