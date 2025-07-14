import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useNavigation } from '../../../../core/context/NavigationContext';
import { useAuth } from "../../../auth/hooks"; // ✅ make sure this is correct

interface SidenavProps {}

export const sidenav: React.FC<SidenavProps> = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { navigationItems } = useNavigation();

  const { logout } = useAuth(); // ✅ call at top-level only

  const toggleItem = (link: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [link]: !prev[link]
    }));
  };

  const getIcon = (iconName: string) => {
    if (!iconName) return null;

    const iconMap: { [key: string]: string } = {
      home: 'Home',
      team: 'Users',
      setting: 'Settings',
      'cloud-upload': 'Upload',
      logout: 'LogOut',
      search: 'Search',
      user: 'User',
      'file-text': 'FileText',
      database: 'Database',
      monitor: 'Monitor',
      profile: 'User',
      'check-circle': 'CheckCircle',
      'file-sync': 'FileSync',
      robot: 'Bot',
      container: 'Container',
      calendar: 'Calendar',
      'play-circle': 'PlayCircle',
      'unordered-list': 'List',
      schedule: 'Clock',
      play: 'Play',
      workflow: 'Workflow',
      mobile: 'Smartphone',
      printer: 'Printer',
      crown: 'Crown',
      block: 'Square',
      apartment: 'Building',
      upload: 'Upload',
      'credit-card': 'CreditCard',
      'plus-circle': 'PlusCircle',
      'usergroup-add': 'Users',
      tool: 'Tool',
      meh: 'Meh',
      disconnect: 'Unlink',
      'pause-circle': 'PauseCircle',
      swap: 'Swap',
      edit: 'Edit',
      wallet: 'Wallet',
      'exclamation-circle': 'AlertCircle',
      mail: 'Mail',
      dollar: 'DollarSign',
      tag: 'Tag',
      'customer-service': 'Headphones',
      'file-done': 'FileCheck',
      send: 'Send',
      'info-circle': 'Info',
      bulb: 'Lightbulb',
      phone: 'Phone',
      code: 'Code',
      form: 'FileText',
      link: 'Link',
      plus: 'Plus',
      delete: 'Trash2',
      sync: 'RefreshCw',
      camera: 'Camera',
      wifi: 'Wifi',
      'cloud-server': 'Server',
      'dollar-circle': 'CircleDollarSign',
      'file-protect': 'Shield',
      qrcode: 'QrCode',
      car: 'Car',
      function: 'Function',
      'appstore-add': 'AppWindow',
      branches: 'GitBranch',
      ci: 'Activity',
      warning: 'AlertTriangle',
      control: 'Sliders',
      environment: 'Map',
      barcode: 'Barcode'
    };

    const lucideIconName = iconMap[iconName.toLowerCase()] || iconName;
    const pascalCase = lucideIconName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const Icon = (Icons as any)[pascalCase];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const renderMenuItem = (item: any) => {
    const isExpanded = expandedItems[item.link];
    const hasChildren = item.child && item.child.length > 0;
    const isActive = location.pathname === item.link;
    const isLogout = item.label?.toLowerCase() === 'logout';

    const handleClick = (e: React.MouseEvent) => {
      if (isLogout) {
        e.preventDefault();
        logout(); // ✅ uses top-level hook
      } else if (hasChildren) {
        toggleItem(item.link);
      }
    };

    const menuItemContent = (
      <div
        className={`flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 cursor-pointer ${
          isActive ? 'bg-blue-100 text-blue-600' : 'text-black'
        }`}
        onClick={handleClick}
      >
        <span className="mr-3">{getIcon(item.iconName)}</span>
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {hasChildren && (
              <span className="ml-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </span>
            )}
          </>
        )}
      </div>
    );

    return (
      <li key={item.link} className="relative">
        {item.isLink && !isLogout ? (
          <Link to={item.link}>{menuItemContent}</Link>
        ) : (
          menuItemContent
        )}
        {hasChildren && isExpanded && !collapsed && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.child.map((child: any) => (
              <li key={`${item.link}-${child.link}`}>
                <Link
                  to={child.link}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 ${
                    location.pathname === child.link ? 'bg-blue-100 text-blue-600' : 'text-black'
                  }`}
                >
                  <span className="mr-3">{getIcon(child.iconName)}</span>
                  <span>{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`bg-white h-full shadow flex flex-col py-4 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      <button
        className="flex items-center px-4 py-2 mb-2 rounded-lg hover:bg-blue-50 transition-colors"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        style={{ minHeight: '40px' }}
      >
        <span className="mr-3"><Menu className="h-6 w-6 text-blue-600" /></span>
        {!collapsed && <span className="font-semibold text-blue-600">Menu</span>}
      </button>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems?.map(renderMenuItem) || (
            <li key="no-items" className="px-4 py-2 text-gray-500">No navigation items available</li>
          )}
        </ul>
      </nav>
    </aside>
  );
};
