import Metadata from './en/Metadata.json';
import Navigation from './en/Navigation.json';
import Home from './en/Home.json';
import Booking from './en/Booking.json';
import Notifications from './en/Notifications.json';
import { type I18nNamespace } from '../types';

export const messages = {
  Metadata,
  Navigation,
  Home,
  Booking,
  Notifications,
} satisfies { [ns in I18nNamespace]: any };
