export type User = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  age: number;
  preferences: {
    ageRange: [number, number];
    genders: Array<'male' | 'female' | 'non-binary' | 'other'>;
  };
  interests: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  date: string;
  time: string;
  imageURL: string;
  hostId: string;
  attendees: {
    id: string;
    photoURL?: string;
  }[];
  interestedUsers: string[];
  maxAttendees?: number;
  category: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventPreview = Pick<
  Event,
  'id' | 'title' | 'imageURL' | 'date' | 'time' | 'location' | 'attendees' | 'interestedUsers'
>;

export type MapMarker = {
  id: string;
  coordinates: [number, number];
  eventId: string;
  title: string;
};

export type Theme = 'light' | 'dark';

export type InterestCategory = {
  name: string;
  emoji: string;
  interests: string[];
}; 