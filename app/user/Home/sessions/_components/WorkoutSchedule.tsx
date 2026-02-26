import React, { Fragment } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DumbbellIcon,
  MapPinIcon,
} from 'lucide-react'
export function WorkoutSchedule() {
  const days = [
    {
      name: 'Sunday',
      date: '24',
      sessions: [],
    },
    {
      name: 'Monday',
      date: '25',
      sessions: [
        {
          title: 'HIIT Cardio',
          time: '07:00 AM',
          duration: '45 min',
          type: 'Cardio',
          color: 'orange',
        },
        {
          title: 'Upper Body Power',
          time: '06:00 PM',
          duration: '60 min',
          type: 'Strength',
          color: 'blue',
        },
      ],
    },
    {
      name: 'Tuesday',
      date: '26',
      sessions: [
        {
          title: 'Yoga Flow',
          time: '08:00 AM',
          duration: '60 min',
          type: 'Flexibility',
          color: 'green',
        },
      ],
    },
    {
      name: 'Wednesday',
      date: '27',
      sessions: [],
    },
    {
      name: 'Thursday',
      date: '28',
      sessions: [
        {
          title: 'Full Body Crush',
          time: '05:30 PM',
          duration: '50 min',
          type: 'Strength',
          color: 'purple',
        },
      ],
    },
    {
      name: 'Friday',
      date: '01',
      sessions: [],
    },
    {
      name: 'Saturday',
      date: '02',
      sessions: [],
    },
  ]
  const getSessionColor = (color: string) => {
    switch (color) {
      case 'orange':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-500'
      case 'blue':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500'
      case 'green':
        return 'bg-green-500/10 border-green-500/20 text-green-500'
      case 'purple':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-500'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-500'
    }
  }
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <ChevronLeftIcon size={24} />
          </button>
          <h1 className="text-4xl font-bold text-white font-heading uppercase tracking-wider">
            Workout <span className="text-orange-500">Sessions</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-[#1a1a24] p-1.5 rounded-lg border border-white/5">
          <button className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white">
            <ChevronLeftIcon size={20} />
          </button>
          <span className="font-medium text-white px-2">Feb 2026</span>
          <button className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white">
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-[#1a1a24] rounded-2xl border border-white/5 overflow-hidden flex-1 shadow-2xl shadow-black/20">
        <div className="grid grid-cols-[120px_1fr] h-full divide-y divide-white/5">
          {days.map((day, index) => (
            <Fragment key={day.name}>
              {/* Day Column */}
              <div
                className={`p-6 border-r border-white/5 flex flex-col justify-center items-center ${day.name === 'Monday' ? 'bg-orange-500/5' : ''}`}
              >
                <span
                  className={`text-sm font-medium uppercase tracking-wider mb-1 ${day.name === 'Monday' ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  {day.name.substring(0, 3)}
                </span>
                <span
                  className={`text-2xl font-bold font-heading ${day.name === 'Monday' ? 'text-white' : 'text-gray-400'}`}
                >
                  {day.date}
                </span>
              </div>

              {/* Sessions Column */}
              <div
                className={`p-4 flex items-center gap-4 overflow-x-auto ${day.name === 'Monday' ? 'bg-orange-500/5' : ''}`}
              >
                {day.sessions.length > 0 ? (
                  day.sessions.map((session, sIndex) => (
                    <div
                      key={sIndex}
                      className={`flex-shrink-0 w-64 p-4 rounded-xl border ${getSessionColor(session.color)} hover:scale-[1.02] transition-transform cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/20">
                          {session.type}
                        </span>
                        <ClockIcon size={14} className="opacity-70" />
                      </div>
                      <h4 className="text-lg font-bold text-white font-heading mb-2">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm opacity-80">
                        <div className="flex items-center gap-1">
                          <ClockIcon size={14} />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DumbbellIcon size={14} />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full flex items-center px-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                      <div className="w-8 h-8 rounded-full border border-dashed border-current flex items-center justify-center">
                        +
                      </div>
                      Add Session
                    </button>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
