
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '@core/context/NavigationContext';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@shared/ui/breadcrumb';

export function useBaseComponent() {
  const [error, setError] = useState<Error | undefined>(undefined);

  const location = useLocation();
  const { navigationItems } = useNavigation();

  function renderError() {
    if (!error) return null;
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-lg font-semibold text-red-800">Error</h2>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  function renderBreadcrumbs() {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Add home breadcrumb
    breadcrumbs.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
    );

    // Build breadcrumbs based on current path
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Find matching navigation item
      const navItem = navigationItems?.find(item => item.link === currentPath);
      const label = navItem?.label || segment;

      breadcrumbs.push(
        <BreadcrumbItem key={currentPath}>
          {isLast ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={currentPath}>{label}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );
    });

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return {
    error,
    setError,
    renderError,
    renderBreadcrumbs,
  };
} 