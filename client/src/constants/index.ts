import { Trip, User, Review, Booking, ChatConversation, CustomTripRequest } from '../types';

export const CATEGORIES = [
  { name: 'Trekking', icon: 'Mountain' },
  { name: 'Beach', icon: 'Waves' },
  { name: 'Adventure', icon: 'Compass' },
  { name: 'Camping', icon: 'Tent' },
  { name: 'Spiritual', icon: 'Sparkles' },
  { name: 'Nature', icon: 'Trees' },
  { name: 'Historical', icon: 'BookOpen' },
  { name: 'Wildlife', icon: 'Footprints' },
] as const;

export const POPULAR_DESTINATIONS = [
  { name: 'Coorg', image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&auto=format&fit=crop&q=80', tag: 'Scotland of India' },
  { name: 'Chikmagalur', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', tag: 'Coffee Land' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=800&auto=format&fit=crop&q=80', tag: 'Snowy Peak' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', tag: 'Sun & Surf' },
  { name: 'Kashmir', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80', tag: 'Heaven on Earth' },
  { name: 'Ooty', image: 'https://images.unsplash.com/photo-1538964173425-85c6a1e8b5c2?w=800&auto=format&fit=crop&q=80', tag: 'Blue Mountains' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80', tag: 'God\'s Own Country' },
  { name: 'Andaman', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80', tag: 'Tropical Paradise' },
];

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: 'user-customer-1',
    name: 'Rithish N',
    email: 'rithish@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
  },
  organizer1: {
    id: 'user-org-1',
    name: 'Adventure Nest',
    email: 'contact@adventurenest.com',
    role: 'organizer',
    companyName: 'Adventure Nest India',
    description: 'Premier eco-adventure trip host specializing in Western Ghats trekking, camping, and pristine nature discovery expeditions.',
    phone: '+91 98765 43210',
    website: 'https://adventurenest.com',
    address: 'Indiranagar, Bangalore, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    tripsConducted: 142,
    customersServed: 3200,
    rating: 4.8,
    yearsActive: 5,
  },
  organizer2: {
    id: 'user-org-2',
    name: 'Himalayan Trails',
    email: 'trek@himalayantrails.com',
    role: 'organizer',
    companyName: 'Himalayan Trails Ltd',
    description: 'Professional high-altitude mountaineering team hosting treks, skiing adventures, and spiritual retreats in Kashmir & Himachal.',
    phone: '+91 87654 32109',
    website: 'https://himalayantrails.com',
    address: 'Mall Road, Manali, Himachal Pradesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    tripsConducted: 89,
    customersServed: 1450,
    rating: 4.9,
    yearsActive: 4,
  },
  admin: {
    id: 'user-admin-1',
    name: 'System Admin',
    email: 'admin@vegana.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  }
};

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'Coorg Coffee Plantation & Ridge Trek',
    category: 'Trekking',
    destination: 'Coorg',
    description: 'Trek along the beautiful ridges of Coorg and walk through emerald green coffee estates. Experience lush organic farming, waterfalls, and local Kodava cuisine.',
    durationDays: 3,
    rating: 4.8,
    reviewsCount: 24,
    organizerId: 'user-org-1',
    organizerName: 'Adventure Nest',
    organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&auto=format&fit=crop&q=80',
    maxSeats: 15,
    availableSeats: 8,
    dates: ['2026-06-12', '2026-06-26'],
    itinerary: [
      { day: 1, title: 'Arrival & Plantation Walk', description: 'Reach Coorg homestay, enjoy traditional lunch, and tour the aromatic organic coffee estates.', activities: ['Plantation Tour', 'Kodava Dinner'] },
      { day: 2, title: 'Ridge Trek to Tadiandamol Peak', description: 'Trek the highest peak in Coorg, offering spectacular views of the clouds rolling over forest ridges.', activities: ['8km Hike', 'Summit Photography', 'Sunset views'] },
      { day: 3, title: 'Chelavara Falls & Departure', description: 'Visit the stunning Chelavara waterfalls and depart back to Bangalore with memorable moments.', activities: ['Waterfall visit', 'Souvenir shopping'] }
    ],
    included: ['Home Stay Sharing Accomodation', 'All Meals (Traditional)', 'Guided Ridge Trekking', 'Forest Entry Permits'],
    excluded: ['Travel to/from Coorg', 'Personal Expenses', 'Camera charges'],
    meetingPoint: 'Madikeri KSRTC Bus Stand',
    featured: true,
    status: 'published'
  },
  {
    id: 'trip-2',
    title: 'Manali Solang Snow & Adventure Festival',
    category: 'Adventure',
    destination: 'Manali',
    description: 'Experience winter adventure sport like paragliding, skiing, and snow hiking in the breathtaking valleys of Solang and Rohtang in Manali.',
    durationDays: 5,
    rating: 4.9,
    reviewsCount: 42,
    organizerId: 'user-org-2',
    organizerName: 'Himalayan Trails',
    organizerLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=800&auto=format&fit=crop&q=80',
    maxSeats: 12,
    availableSeats: 5,
    dates: ['2026-06-15', '2026-07-02'],
    itinerary: [
      { day: 1, title: 'Manali Check-in & Solang Valley Visit', description: 'Arrive at the alpine hotel, acclimatize, and visit Solang valley for evening recreation.', activities: ['Hotel Check-in', 'Explore Solang', 'Welcome Bonfire'] },
      { day: 2, title: 'Skiing Lesson & Snow Activities', description: 'Full day skiing under professional certified experts in snow parks.', activities: ['Ski Training', 'Snowboarding', 'Hot cocoa break'] },
      { day: 3, title: 'Paragliding & Jogini Falls Hike', description: 'Glide across the Himalayan skies with tandem pilots and hike to scenic cascading Jogini Falls.', activities: ['Tandem Paragliding', '3km pine forest hike'] },
      { day: 4, title: 'Rohtang Pass Snow Tour', description: 'Travel through Atal Tunnel to enjoy spectacular high-altitude glaciers and snowy vistas.', activities: ['Atal Tunnel Drive', 'Snow play'] },
      { day: 5, title: 'Old Manali Explorer & Departure', description: 'Café-hopping in Old Manali, shopping for handmade wood and wool crafts, and late departure.', activities: ['Old Manali Cafes', 'Local temples'] }
    ],
    included: ['Premium Wooden Alpine Resort Stay', 'Buffet Breakfast & Dinner', 'Skiing Gear & Professional Guide', 'Paragliding Tickets'],
    excluded: ['Rohtang permit extra fees', 'Alcoholic beverages', 'Flight tickets'],
    meetingPoint: 'Mall Road, Manali Office',
    featured: true,
    status: 'published'
  },
  {
    id: 'trip-3',
    title: 'South Goa Hidden Beach Campout',
    category: 'Beach',
    destination: 'Goa',
    description: 'Camp under the stars on private, pristine beaches in South Goa. Go kayaking, watch dolphins, and enjoy fresh sea-side barbecues away from the crowded tourist spots.',
    durationDays: 4,
    rating: 4.7,
    reviewsCount: 18,
    organizerId: 'user-org-1',
    organizerName: 'Adventure Nest',
    organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    maxSeats: 20,
    availableSeats: 12,
    dates: ['2026-06-18', '2026-07-09'],
    itinerary: [
      { day: 1, title: 'Secret Beach Camping Setup', description: 'Arrive at the remote cove beach via boat, pitch your camps, and enjoy sunset swim.', activities: ['Beach Tents Setup', 'Sunset Swim', 'Beach Volley'] },
      { day: 2, title: 'Mangrove Kayaking & Fishing', description: 'Paddle through serene backwater mangroves and catch sea bass for dinner.', activities: ['Kayaking Tour', 'Traditional Fishing', 'BBQ Grill Night'] },
      { day: 3, title: 'Dolphin Safari & Cola Beach Lagoon', description: 'Early morning boat cruise to spot dolphins and hike to Cola freshwater lagoon.', activities: ['Dolphin Cruise', 'Freshwater Lagoon Swim'] },
      { day: 4, title: 'Coastal Trek & Departure', description: 'Hike across cliffs to Cabo de Rama fort and depart with unforgettable beach vibes.', activities: ['Fort hike', 'Local Goan fish curry lunch'] }
    ],
    included: ['Beachfront Camping Tents', 'Breakfast & Barbecue Dinner', 'Kayaking Equipment & Boat Fees', 'Dolphin Cruise Ticket'],
    excluded: ['Lunch', 'Scooter rentals', 'Personal shopping'],
    meetingPoint: 'Canacona Railway Station',
    featured: true,
    status: 'published'
  },
  {
    id: 'trip-4',
    title: 'Kashmir Great Lakes Alpine Trek',
    category: 'Trekking',
    destination: 'Kashmir',
    description: 'The ultimate trek in India traversing high altitude passes, silver streams, wildflower meadows, and pristine turquoise alpine lakes like Vishansar and Gadsar.',
    durationDays: 7,
    rating: 5.0,
    reviewsCount: 31,
    organizerId: 'user-org-2',
    organizerName: 'Himalayan Trails',
    organizerLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
    maxSeats: 10,
    availableSeats: 4,
    dates: ['2026-07-01', '2026-07-15'],
    itinerary: [
      { day: 1, title: 'Srinagar to Sonamarg Camps', description: 'Arrive in Sonamarg, camp along the roaring Sindh River, and brief on safety.', activities: ['Acclimatization', 'Campside dinner'] },
      { day: 2, title: 'Sonamarg to Nichnai Pass', description: 'Start the hike passing through lush green birch forests and pristine streams.', activities: ['11km trek', 'Campsite set at Nichnai'] },
      { day: 3, title: 'Nichnai to Vishansar Alpine Lake', description: 'Cross the high Nichnai Pass (13,500 ft) to witness the first stunning turquoise lake.', activities: ['High pass crossing', 'Vishansar lakeshore camp'] },
      { day: 4, title: 'Rest & Trout Fishing at Kishansar Lake', description: 'Spend a relaxing day exploring dual lakes, trout fishing and capturing views.', activities: ['Trout fishing', 'Lake hikes'] },
      { day: 5, title: 'Vishansar to Gadsar via Gadsar Pass', description: 'Trek up to Gadsar Pass (13,750 ft) to see the highest point and cascading glaciers.', activities: ['14km steep hike', 'Gadsar lake photography'] },
      { day: 6, title: 'Gadsar to Satsar Lakes', description: 'Trek along rocky trails to reach Satsar, a cluster of seven interconnected lakes.', activities: ['9km walk', 'Rock climbing'] },
      { day: 7, title: 'Satsar to Naranag & Srinagar Departure', description: 'Descend through dense pine forests to ancient Naranag temple and drive to Srinagar.', activities: ['Steep descent', 'Naranag ruins visit', 'Airport drops'] }
    ],
    included: ['High Mountain Tents & Sleeping Bags', 'All nutritious veg meals on trek', 'Ponies for luggage', 'Certified Mountaineering Guides', 'Inner Line Permits'],
    excluded: ['Srinagar hotel stay', 'Insurance cover', 'Personal gears like boots'],
    meetingPoint: 'TRC Srinagar Office',
    featured: false,
    status: 'published'
  },
  {
    id: 'trip-5',
    title: 'Mullayanagiri peak camping expedition',
    category: 'Camping',
    destination: 'Chikmagalur',
    description: 'Camp atop the highest peak of Karnataka. Watch a breathtaking sunrise from the peak, trek through shola grasslands, and enjoy hot coffee at the estates.',
    durationDays: 2,
    rating: 4.6,
    reviewsCount: 15,
    organizerId: 'user-org-1',
    organizerName: 'Adventure Nest',
    organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    maxSeats: 25,
    availableSeats: 18,
    dates: ['2026-06-20', '2026-07-04'],
    itinerary: [
      { day: 1, title: 'Base Trek & Ridge Camping', description: 'Start the Mullayanagiri ridge trek and pitch camp tents at a designated grassland site.', activities: ['Grassland Trek', 'Sunset viewing', 'Campfire & acoustic session'] },
      { day: 2, title: 'Mullayanagiri Peak Sunrise & Baba Budangiri Drive', description: 'Climb the steps to the ancient Shiva temple for sunrise, drive to Budangiri caves.', activities: ['Sunrise summit', 'Cave exploration', 'Estate coffee tasting'] }
    ],
    included: ['Outdoor Camping Tents', 'Dinner & Breakfast', 'Certified Trekleader', 'Forest permits & entry fees'],
    excluded: ['Transportation', 'Custom lunches'],
    meetingPoint: 'Chikmagalur KSRTC Bus stand',
    featured: false,
    status: 'published'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    tripId: 'trip-1',
    authorName: 'Aarav Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The Coorg Ridge Trek was beautifully organized! Walking through the coffee aroma was out of this world and the local food prepared at the homestay was incredibly delicious.',
    date: '2026-05-15'
  },
  {
    id: 'rev-2',
    tripId: 'trip-1',
    authorName: 'Sneha Rao',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 4.6,
    comment: 'Spectacular views from Tadiandamol! The guides from Adventure Nest were highly attentive and knew the trails inside out. Accommodation was cozy and clean.',
    date: '2026-05-20'
  },
  {
    id: 'rev-3',
    tripId: 'trip-2',
    authorName: 'Kunal Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Skiing in Solang was my dream, and Himalayan Trails made it awesome. Tandem paragliding was breathtaking! Super professional team, and the food was outstanding.',
    date: '2026-05-18'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    tripId: 'trip-1',
    tripTitle: 'Coorg Coffee Plantation & Ridge Trek',
    tripImage: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=200&auto=format&fit=crop&q=80',
    customerId: 'user-customer-1',
    customerName: 'Rithish N',
    organizerId: 'user-org-1',
    date: '2026-06-12',
    seats: 2,
    totalPrice: 6998,
    status: 'pending',
    createdAt: '2026-05-28T10:30:00Z'
  },
  {
    id: 'book-2',
    tripId: 'trip-3',
    tripTitle: 'South Goa Hidden Beach Campout',
    tripImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
    customerId: 'user-customer-1',
    customerName: 'Rithish N',
    organizerId: 'user-org-1',
    date: '2026-06-18',
    seats: 1,
    totalPrice: 4999,
    status: 'confirmed',
    createdAt: '2026-05-26T14:15:00Z'
  }
];

export const INITIAL_CUSTOM_TRIPS: CustomTripRequest[] = [
  {
    id: 'custom-1',
    customerId: 'user-customer-1',
    customerName: 'Rithish N',
    destination: 'Kerala',
    budget: 15000,
    groupSize: 4,
    tripType: 'Nature & Backwaters',
    travelDates: '2026-07-10 to 2026-07-14',
    requirements: 'Need private houseboat in Alleppey, Ayurvedic massage sessions, and spice garden visits in Munnar. Pure vegetarian food requested.',
    status: 'responded',
    createdAt: '2026-05-27T08:00:00Z',
    proposals: [
      {
        id: 'prop-1',
        organizerId: 'user-org-1',
        organizerName: 'Adventure Nest',
        organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        price: 13999,
        itineraryDescription: 'Exclusive 5-day Kerala tour including: 2 nights wooden villa in Munnar with personal estate tour, 1 night luxury full-board Houseboat in Alleppey backwaters, and Ayurvedic wellness spa treatments in Kumarakom.',
        travelDates: '2026-07-10 to 2026-07-14',
        status: 'pending'
      }
    ]
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    participantId: 'user-org-1',
    participantName: 'Adventure Nest (Eco Host)',
    participantLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    participantRole: 'organizer',
    lastMessage: 'Hi Rithish, we have updated your custom proposal details. Let us know if you have any questions!',
    lastMessageTime: '13:02 PM',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    participantId: 'user-org-2',
    participantName: 'Himalayan Trails (Trek Team)',
    participantLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantRole: 'organizer',
    lastMessage: 'No worries! Warm gears are included in the winter package.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  }
];
