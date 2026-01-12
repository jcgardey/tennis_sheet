import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, User } from 'lucide-react'
import dayjs from 'dayjs'
import type { Court, Reservation } from '@/components/booking/CourtGrid'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

// Generar slots cada 30 minutos desde las 08:00 hasta las 22:00
const TIME_SLOTS = Array.from({ length: 29 }, (_, i) => {
  const hours = Math.floor(i / 2) + 8
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hours.toString().padStart(2, '0')}:${minutes}`
})

const COURTS: Court[] = [
  { id: 1, name: 'Cancha 1 (Polvo)' },
  { id: 2, name: 'Cancha 2 (Césped)' },
  { id: 3, name: 'Cancha 3 (Rápida)' },
  { id: 4, name: 'Cancha 4 (Polvo)' },
]

const MOCK_RESERVATIONS: Record<number, Reservation[]> = {
  1: [ { start: new Date('2024-05-24T08:30:00'), durationInMinutes: 90, description: 'Juan Pérez' } ],
  2: [ { start: new Date('2024-05-24T10:00:00'), durationInMinutes: 60, description: 'María García' } ],
  3: [ { start: new Date('2024-05-24T09:00:00'), durationInMinutes: 30, description: 'Pedro Soto' }, { start: new Date('2024-05-24T11:00:00'), durationInMinutes: 120, description: 'Clínica Tenis' } ],
  4: [],
}

function Dashboard() {
  const getReservation = (courtId: number, time: string) => (MOCK_RESERVATIONS[courtId] || []).find(r => dayjs(r.start).format('HH:mm') === time)

  const getReservationSlots = (reservation: Reservation) => Math.ceil(reservation.durationInMinutes / 30)

  const isSlotOccupiedByPrior = (courtId: number, time: string) => {
    return (MOCK_RESERVATIONS[courtId] || []).some(r => {
      const startIndex = TIME_SLOTS.indexOf(dayjs(r.start).format('HH:mm'))
      const currentIndex = TIME_SLOTS.indexOf(time)
      return currentIndex > startIndex && currentIndex < startIndex + getReservationSlots(r)
    })
  }

  // Calcula cuántos slots seguidos están libres para una cancha
  const getAvailableDuration = (courtId: number, startTime: string) => {
    const startIndex = TIME_SLOTS.indexOf(startTime)
    let duration = 0
    for (let i = startIndex; i < TIME_SLOTS.length; i++) {
      const time = TIME_SLOTS[i]
      if (getReservation(courtId, time) || isSlotOccupiedByPrior(courtId, time)) {
        break
      }
      duration++
    }
    return duration
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Reservas</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" /> Hoy, 24 de Mayo de 2024
            </p>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Ocupado</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-border bg-background" /> Disponible</span>
          </div>
        </div>

        {/* Grilla Horaria */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-4 border-b border-r border-border text-left font-semibold text-sm sticky left-0 bg-muted/50 z-20 w-28">
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> Hora</div>
                  </th>
                  {COURTS.map(court => (
                    <th key={court.id} className="p-4 border-b border-border text-center font-semibold text-sm min-w-[220px]">
                      <div className="flex flex-col items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        {court.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((time, index) => (
                  <tr key={time} className="group h-12">
                    {/* Agrupación de Horarios (:00 abarca el slot de :30) */}
                    {time.endsWith(':00') ? (
                      <td 
                        className="p-3 border-r border-b border-border text-sm font-bold text-muted-foreground bg-muted/5 sticky left-0 z-10 align-middle text-center"
                        rowSpan={2}
                      >
                        {time.split(':')[0]}hs
                      </td>
                    ) : (
                      // Si es el último slot impar, se renderiza solo, de lo contrario lo cubre el :00
                      index === TIME_SLOTS.length - 1 ? (
                        <td className="p-3 border-r border-b border-border text-sm font-bold text-muted-foreground bg-muted/5 sticky left-0 z-10 align-middle text-center">
                          {time}
                        </td>
                      ) : null
                    )}

                    {COURTS.map(court => {
                      const res = getReservation(court.id, time)
                      const isOccupiedLater = isSlotOccupiedByPrior(court.id, time)

                      // Caso 1: Inicio de una reserva
                      if (res) {
                        const slots = getReservationSlots(res)
                        return (
                          <td 
                            key={court.id} 
                            className="p-1 border-b border-border align-top"
                            rowSpan={slots}
                          >
                            <div className="h-full min-h-[40px] bg-primary/10 border border-primary/30 text-primary rounded-lg p-3 shadow-sm flex flex-col justify-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
                              <div className="flex items-center gap-1.5 font-bold text-sm">
                                <User className="w-3.5 h-3.5" />
                                {res.description}
                              </div>
                              <div className="text-[10px] font-medium opacity-80 uppercase tracking-tight">
                                {res.durationInMinutes} min
                              </div>
                            </div>
                          </td>
                        )
                      }

                      // Caso 2: Slot ocupado por la expansión de una reserva previa
                      if (isOccupiedLater) return null

                      // Caso 3: Manejo de bloques libres contiguos
                      const prevTime = index > 0 ? TIME_SLOTS[index - 1] : null
                      const wasFree = prevTime ? (!getReservation(court.id, prevTime) && !isSlotOccupiedByPrior(court.id, prevTime)) : false
                      
                      // Solo renderizamos si es el inicio de un bloque libre
                      if (!wasFree) {
                        const duration = getAvailableDuration(court.id, time)
                        return (
                          <td 
                            key={court.id} 
                            className="p-1 border-b border-border align-top"
                            rowSpan={duration}
                          >
                            <button className="w-full h-full min-h-[44px] group flex flex-col items-center justify-center rounded-md border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150 cursor-pointer">
                              <CheckCircle2 className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary/60 transition-colors" />
                              {duration > 1 && (
                                <span className="text-[10px] text-muted-foreground/40 group-hover:text-primary/60 mt-1">
                                  {duration * 30} min libres
                                </span>
                              )}
                            </button>
                          </td>
                        )
                      }

                      return null
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}