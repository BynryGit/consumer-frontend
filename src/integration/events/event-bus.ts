import { Event, EventType } from './event-types';

type EventCallback<T = any> = (event: Event<T>) => void;

class EventBus {
  private listeners: Map<EventType, EventCallback[]> = new Map();
  private static instance: EventBus;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(eventType: EventType, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType)!.push(callback as EventCallback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType) || [];
      const index = callbacks.indexOf(callback as EventCallback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  public publish<T = any>(eventType: EventType, payload: T): void {
    const event: Event<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

// React hook for using the event bus
import { useEffect } from 'react';

export function useEventSubscription<T = any>(
  eventType: EventType,
  callback: (payload: T) => void
): void {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe<T>(eventType, (event) => {
      callback(event.payload);
    });

    return unsubscribe;
  }, [eventType, callback]);
} 