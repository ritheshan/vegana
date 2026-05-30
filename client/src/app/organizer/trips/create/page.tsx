'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/store/useTripStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles, Compass, ArrowRight, ArrowLeft, Check,
  Clock, Landmark, IndianRupee, Image, PlusCircle, Trash2, Calendar, Users
} from 'lucide-react';

export default function CreateTripPage() {
  const router = useRouter();
  const { addTrip } = useTripStore();

  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  // Consolidated Form State
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<'Trekking' | 'Beach' | 'Adventure' | 'Camping' | 'Spiritual' | 'Nature' | 'Historical' | 'Wildlife'>('Trekking');
  const [description, setDescription] = React.useState('');
  const [duration, setDuration] = React.useState(3);

  const [destination, setDestination] = React.useState('');
  const [meetingPoint, setMeetingPoint] = React.useState('');

  const [price, setPrice] = React.useState(2999);
  const [capacity, setCapacity] = React.useState(15);

  const [imageUrl, setImageUrl] = React.useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800');

  const [itinerary, setItinerary] = React.useState<{ day: number; title: string; description: string; activities: string[] }[]>([
    { day: 1, title: 'Arrival & Welcomes', description: 'Check-in to camp resort and enjoy traditional welcome briefings.', activities: ['Check-in', 'Welcome dinner'] },
    { day: 2, title: 'Primary Summit Trek', description: 'Acclimatize and trek the highest ridge point of the scenic valleys.', activities: ['Mountain Hike', 'Photography'] },
    { day: 3, title: 'Waterfall & Departures', description: 'Swim in the cascading streams and depart with amazing memories.', activities: ['Waterfall visit', 'Drops'] }
  ]);

  // Adjust Itinerary Day rows based on duration selection
  React.useEffect(() => {
    const diff = duration - itinerary.length;
    if (diff > 0) {
      const newDays = [...itinerary];
      for (let i = 0; i < diff; i++) {
        const nextDayNum = newDays.length + 1;
        newDays.push({
          day: nextDayNum,
          title: `Day ${nextDayNum} Schedule`,
          description: 'Explore local sights, valleys, and cascades.',
          activities: ['Explore', 'Sightseeing']
        });
      }
      setItinerary(newDays);
    } else if (diff < 0) {
      setItinerary(itinerary.slice(0, duration));
    }
  }, [duration]);

  const handlePublish = () => {
    setSubmitting(true);
    
    setTimeout(() => {
      const newTripId = `trip-${Date.now()}`;
      addTrip({
        id: newTripId,
        title,
        category,
        destination,
        description,
        durationDays: duration,
        rating: 5.0,
        reviewsCount: 0,
        organizerId: 'user-org-1',
        organizerName: 'Adventure Nest',
        organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        price,
        image: imageUrl,
        maxSeats: capacity,
        availableSeats: capacity,
        dates: [new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]], // 2 weeks from now
        itinerary,
        included: ['Home Stay sharing cottage', 'Breakfast & Dinner buffets', 'Licensed Wilderness Trek guide', 'Forest Entry Permits'],
        excluded: ['Personal gears and boots', 'Flight/Train tickets', 'Lunch'],
        meetingPoint,
        status: 'published'
      });

      setSubmitting(false);
      router.push('/organizer/trips');
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && (!title || !description)) return;
    if (step === 2 && (!destination || !meetingPoint)) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const stepsList = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Location' },
    { num: 3, label: 'Pricing' },
    { num: 4, label: 'Photos' },
    { num: 5, label: 'Itinerary' },
    { num: 6, label: 'Publish' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-accent" />
          Create Adventure Package
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Register new wilderness treks, nature trails, or beach camping tours in 6 steps
        </p>
      </div>

      {/* Progress wizard bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        {stepsList.map((s, idx) => {
          const isCompleted = step > s.num;
          const isActive = step === s.num;
          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-accent text-white'
                      : isActive
                      ? 'bg-primary text-white scale-110 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-widest hidden md:inline transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className="h-0.5 bg-slate-100 flex-1 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-all duration-300"
                    style={{ width: step > s.num ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Steps Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6 min-h-[250px]">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 1: General Details
            </h3>
            
            <Input
              label="Trip Title"
              placeholder="e.g. Coorg Coffee Plantation Summit Trek"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              leftIcon={<Compass className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Adventure Category"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                options={[
                  { value: 'Trekking', label: 'Trekking' },
                  { value: 'Beach', label: 'Beach' },
                  { value: 'Adventure', label: 'Adventure' },
                  { value: 'Camping', label: 'Camping' },
                  { value: 'Spiritual', label: 'Spiritual' },
                  { value: 'Nature', label: 'Nature' },
                  { value: 'Historical', label: 'Historical' },
                  { value: 'Wildlife', label: 'Wildlife' }
                ]}
              />

              <Input
                type="number"
                label="Duration (Days)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Detailed Bio Description
              </label>
              <textarea
                placeholder="Walk explorers through the stunning views, cascades, and dining experiences of the trip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-accent text-slate-900 placeholder:text-slate-400 min-h-24"
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: Destination details */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 2: Destination & Meeting Points
            </h3>
            <Input
              label="Destination Town / Area"
              placeholder="e.g. Coorg, Chikmagalur, Manali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              leftIcon={<Compass className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              label="Expedition Meeting Point"
              placeholder="e.g. Madikeri Bus Stand or Sonamarg TRC Office"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              leftIcon={<Landmark className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>
        )}

        {/* STEP 3: Pricing & Capacity */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 3: Pricing & Seat Capacities
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Price Per Guest (₹)"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                leftIcon={<IndianRupee className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                type="number"
                label="Maximum Explorer Seats"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 4: Imagery */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 4: Primary Cover Photography
            </h3>
            
            <Input
              label="Trip Unsplash URL"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              leftIcon={<Image className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
              <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* STEP 5: Itinerary details */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 5: Day-by-Day Schedule Builder
            </h3>
            
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
              {itinerary.map((day, index) => (
                <div key={day.day} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px]">
                      {day.day}
                    </span>
                    Day Schedule Title
                  </span>
                  <Input
                    placeholder="e.g. Plantation Walk & Check-in"
                    value={day.title}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[index].title = e.target.value;
                      setItinerary(updated);
                    }}
                  />
                  <textarea
                    placeholder="Day descriptions..."
                    value={day.description}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[index].description = e.target.value;
                      setItinerary(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-accent text-slate-900 placeholder:text-slate-400 min-h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Summary Review & Publish */}
        {step === 6 && (
          <div className="flex flex-col gap-4 animate-fade-in text-slate-800">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              Step 6: Summary Listing Review
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Badge variant="success" className="font-bold">{category}</Badge>
                  <span className="text-[10px] text-slate-400 font-bold">{duration} Days</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-950 truncate leading-snug">{title || 'Untitled Adventure'}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{destination} • Meeting: {meetingPoint}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600 bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Rate per Explorer</span>
                <span className="text-slate-800 mt-1 font-black text-sm">₹{price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Reservation limit</span>
                <span className="text-slate-800 mt-1 font-black text-sm">{capacity} Explorer Seats</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        {step > 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            className="font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 6 ? (
          <Button
            variant="primary"
            size="sm"
            onClick={nextStep}
            className="font-bold text-xs flex items-center gap-1 cursor-pointer ml-auto"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="accent"
            size="sm"
            isLoading={submitting}
            onClick={handlePublish}
            className="font-extrabold text-xs flex items-center gap-1 cursor-pointer ml-auto"
          >
            Publish Listing
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>

    </div>
  );
}
