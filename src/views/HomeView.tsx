import React from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import {
  Wrench,
  Droplets,
  Car,
  Utensils,
  Sparkles,
  Wind,
  Tv,
  Hammer,
  ShieldCheck,
  Clock,
  ThumbsUp,
  CreditCard,
  Star,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { services, reviews, setCurrentView, setSelectedServiceForBooking } = useApp();

  const handleBookService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setCurrentView('book-service');
  };

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Electrician':
        return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'Plumber':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Car Wash':
        return <Car className="w-5 h-5 text-indigo-600" />;
      case 'Cooking':
        return <Utensils className="w-5 h-5 text-rose-600" />;
      case 'House Cleaning':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'AC Repair':
        return <Wind className="w-5 h-5 text-cyan-600" />;
      case 'Appliance Repair':
        return <Tv className="w-5 h-5 text-purple-600" />;
      case 'General Maintenance':
      default:
        return <Hammer className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="/src/assets/images/hero_apartment_building_1791955632215.jpg"
            alt="Apartment Assist Residential Community"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-indigo-200 border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Trusted On-Site Household Care for Residents</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Your Apartment, <br className="hidden sm:inline" />
            <span className="text-indigo-400">Our Responsibility.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Apartment Assist brings certified electricians, skilled plumbers, professional housekeepers, and prompt appliance technicians directly to your door with upfront pricing and scheduled arrivals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('book-service')}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Book a Service Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-colors backdrop-blur-xs border border-white/15"
            >
              Browse 8 Service Categories
            </button>
          </div>

          {/* Quick Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/10 max-w-3xl mx-auto">
            <div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">15 Mins</div>
              <div className="text-xs text-slate-400">Emergency Dispatch</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">100%</div>
              <div className="text-xs text-slate-400">Verified Personnel</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">4.9 / 5.0</div>
              <div className="text-xs text-slate-400">Resident Satisfaction</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">₹0 Hidden</div>
              <div className="text-xs text-slate-400">Transparent Quotes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Service Cards Section */}
      <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Comprehensive Apartment Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Select Your Required Service
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            All services are provided by verified, background-checked specialists familiar with your apartment building's utilities and layout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {service.image && (
                <div className="h-40 overflow-hidden bg-slate-100 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-medium text-slate-800 flex items-center gap-1.5 shadow-xs">
                    {getServiceIcon(service.name)}
                    <span>{service.category}</span>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-900 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                      From ₹{service.basePrice}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Est: {service.estimatedDuration}</span>
                  </div>

                  <button
                    onClick={() => handleBookService(service)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 group-hover:bg-indigo-600 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Hassle-Free Maintenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How Apartment Assist Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Four streamlined steps connecting residents, dispatch managers, and certified tradespeople in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Choose Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select from our 8 verified categories, describing your problem or requirements in clear notes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Pick Date & Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose a preferred slot (Morning, Afternoon, or Evening) with your apartment and block number.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Certified Arrival</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our building-approved technician accepts the job, arrives promptly, and executes the work cleanly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">Review & Close</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track status in real time, review the completed work, and provide transparent star ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Resident Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Why Apartment Residents Trust Our Unified Booking Service
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Safety & Security First</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Every service provider holds photo ID, background verification, and building security clearance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Building-Specific Expertise</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Technicians are familiar with your building's plumbing risers, main switchgear, and elevator guidelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Live Status Notifications</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Track requests from Pending to Accepted, In Progress, and Completed right on your dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Transparent & Standardized Rates</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    No unpredictable surge pricing or unquoted surcharges. Clear estimated costs upfront.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('register')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Create Resident Account
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src="/src/assets/images/service_home_cleaning_1791955632449.jpg"
              alt="Impeccable apartment upkeep"
              className="w-full h-80 sm:h-96 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">Community Standard Guarantee</span>
                <span className="text-emerald-700 font-semibold">100% Guaranteed</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Not satisfied with the repair? Our building manager ensures free rework within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Verified Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            What Residents Say About Apartment Assist
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{review.feedback}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{review.residentName}</div>
                  <div className="text-slate-500 text-[11px]">{review.serviceName}</div>
                </div>
                {review.providerName && (
                  <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                    By {review.providerName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Contact & Dispatch Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Need Immediate Facilities Assistance?</h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Water leak or critical power failure in your apartment? Our concierge facilities dispatch team is ready 24/7.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('contact-feedback')}
              className="px-5 py-2.5 bg-white text-indigo-950 font-semibold text-xs rounded-lg hover:bg-indigo-50 transition-colors shadow-xs"
            >
              Contact Facilities
            </button>
            <button
              onClick={() => setCurrentView('book-service')}
              className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition-colors border border-indigo-500"
            >
              Book Emergency Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
