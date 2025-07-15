import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Tabs } from '@shared/ui/tabs'; // Your shared tab service
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  MailCheck,
  FileText,
  CreditCard,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

// Type for notification
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  date: string;
  read: boolean;
  category: string;
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Billing Statement Available',
    message: 'Your April 2025 billing statement is now available. Total amount due: $142.58.',
    type: 'info',
    date: '2025-04-09T10:30:00',
    read: false,
    category: 'billing'
  },
  {
    id: 'n2',
    title: 'Payment Confirmation',
    message: 'Thank you! Your payment of $138.72 was successfully processed.',
    type: 'success',
    date: '2025-04-05T15:45:00',
    read: true,
    category: 'billing'
  },
  {
    id: 'n3',
    title: 'Scheduled Maintenance',
    message: 'We will be performing system maintenance in your area on April 15, 2025 from 2:00 AM to 4:00 AM.',
    type: 'warning',
    date: '2025-04-04T09:15:00',
    read: false,
    category: 'service'
  },
  {
    id: 'n4',
    title: 'Usage Alert: High Water Consumption',
    message: 'Your water usage is 40% higher than your usual average. This may indicate a leak or unusual consumption pattern.',
    type: 'alert',
    date: '2025-04-03T20:10:00',
    read: false,
    category: 'usage'
  },
  {
    id: 'n5',
    title: 'Service Request Update',
    message: 'Your service request SR-342189 has been assigned to a technician and is now in progress.',
    type: 'info',
    date: '2025-04-02T11:20:00',
    read: true,
    category: 'service'
  },
  {
    id: 'n6',
    title: 'Successful Auto-Pay Enrollment',
    message: 'You have successfully enrolled in Auto-Pay. Your monthly payments will now be processed automatically.',
    type: 'success',
    date: '2025-03-28T14:50:00',
    read: true,
    category: 'billing'
  },
  {
    id: 'n7',
    title: 'Scheduled Power Outage',
    message: 'A planned power outage is scheduled for your area on April 20, 2025 from 1:00 AM to 3:00 AM for grid maintenance.',
    type: 'warning',
    date: '2025-03-25T16:30:00',
    read: true,
    category: 'service'
  },
  // New notices
  {
    id: 'n8',
    title: 'Final Disconnection Notice',
    message: 'This is a final notice regarding overdue payment of $285.45. Your service will be disconnected on April 25, 2025 if payment is not received by April 23, 2025.',
    type: 'alert',
    date: '2025-04-10T09:00:00',
    read: false,
    category: 'notice'
  },
  {
    id: 'n9',
    title: 'Service Disconnection Notice',
    message: 'Your utility service is scheduled for disconnection on April 30, 2025 due to non-payment. Contact customer service to arrange payment and avoid disconnection.',
    type: 'warning',
    date: '2025-04-08T14:30:00',
    read: false,
    category: 'notice'
  },
  {
    id: 'n10',
    title: 'Legal Notice - Collections',
    message: 'Your account has been referred to our collections department. Immediate payment is required to avoid further legal action.',
    type: 'alert',
    date: '2025-04-01T10:15:00',
    read: true,
    category: 'notice'
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Filter notifications based on active tab
  const getFilteredNotifications = (activeTab: string) => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.category === activeTab);
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'billing':
        return <CreditCard className="h-4 w-4" />;
      case 'usage':
        return <FileText className="h-4 w-4" />;
      case 'notice':
        return <AlertCircle className="h-4 w-4" />;
      case 'service':
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle view notice
  const handleViewNotice = (notificationId: string) => {
    // Mark as read when viewing
    markAsRead(notificationId);
    // Here you could navigate to a detailed notice page or open a modal
    console.log('Viewing notice:', notificationId);
  };

  // Create tab content component
  const createTabContent = (tabValue: string) => {
    const filteredNotifications = getFilteredNotifications(tabValue);
    
    return (
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`border rounded-lg p-4 transition-colors ${
                notification.read ? 'bg-card' : 'bg-muted/20'
              } ${notification.category === 'notice' ? 'border-red-200 bg-red-50/50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${!notification.read && 'font-semibold'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(notification.category)}
                        <span className="capitalize">{notification.category}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            disabled={notification.read}
                          >
                            <MailCheck className="mr-2 h-4 w-4" />
                            Mark as read
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mt-1">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(notification.date)}
                    </div>
                    
                    {notification.id === 'n8' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNotice(notification.id);
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Notice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto opacity-20 mb-3" />
            <p>No notifications to display</p>
          </div>
        )}
      </div>
    );
  };

  // Tab configuration for your shared tab service - exact same tabs as original
  const tabComponents = {
    all: {
      label: 'All',
      component: createTabContent('all')
    },
    unread: {
      label: 'Unread',
      component: createTabContent('unread')
    },
    notice: {
      label: 'Notices',
      icon: <AlertCircle className="h-4 w-4" />,
      component: createTabContent('notice')
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notification Center</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with important alerts and notifications
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge>{unreadCount} unread</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Using your shared tab service with exact same layout */}
            <div className="space-y-4">
              <Tabs
                defaultValue="all"
                tabComponents={tabComponents}
                urlMapping={{
                  all: 'all',
                  unread: 'unread',
                  notice: 'notice'
                }}
                tabsListClassName="grid grid-cols-3 w-full"
                tabsListFullWidth={true}
                idPrefix="notifications"
              />
            </div>
          </CardContent>
        </Card>
      </div>

  );
};

export default NotificationCenter;