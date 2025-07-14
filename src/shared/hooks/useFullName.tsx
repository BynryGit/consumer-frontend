import { useMemo } from "react";

interface NameObject {
  firstName?: string | null;
  lastName?: string | null;
}

export const useFullName = (data: NameObject) => {
  const fullName = useMemo(() => {
    const firstName = data?.firstName?.trim();
    const lastName = data?.lastName?.trim();

    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "NA";
  }, [data]);

  return fullName;
};