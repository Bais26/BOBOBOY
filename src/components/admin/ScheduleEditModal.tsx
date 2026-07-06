'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import idLocale from '@fullcalendar/core/locales/id';
import { ArrowPathIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import Swal from 'sweetalert2';

// Define types for better safety and clarity
type DayStatus = 'WFO' | 'WFH' | 'OFF';

interface ScheduleEvent {
  title: DayStatus;
  start: string;
  allDay: boolean;
  color: string;
  extendedProps?: any;
}

interface Employee {
  employeeCode: string;
  userId: string;
  name: string;
}

interface ScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const STATUS_COLORS: Record<DayStatus, string> = {
  WFO: '#16a34a', // Green
  WFH: '#3b82f6', // Blue
  OFF: '#6b7280', // Gray
};

export default function ScheduleEditModal({ isOpen, onClose, employee }: ScheduleEditModalProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [initialEvents, setInitialEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchSchedule = async (userId: string, date: Date) => {
  setIsLoading(true);
  let isDataFound = false;
  try {
    // Hitung tanggal awal dan akhir bulan
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0); // hari terakhir bulan itu

    const formatDate = (d: Date) => d.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const response = await api.get(`/v1/schedule/${userId}`, {
      params: {
        start_date: formatDate(startOfMonth),
        end_date: formatDate(endOfMonth),
      },
    });

    const scheduleData = response.data?.detail_schedule || [];

    if (Array.isArray(scheduleData) && scheduleData.length > 0) {
      const formattedEvents: ScheduleEvent[] = scheduleData
        .filter((item: any) => item.tanggal && item.work_status)
        .map((item: any) => ({
          title: item.work_status as DayStatus,
          start: item.tanggal.split('T')[0],
          allDay: true,
          color: STATUS_COLORS[item.work_status as DayStatus],
        }));

      setEvents(formattedEvents);
      setInitialEvents(JSON.parse(JSON.stringify(formattedEvents)));
      isDataFound = formattedEvents.length > 0;
    } else {
      setEvents([]);
      setInitialEvents([]);
    }

  } catch (error) {
    console.error("Failed to fetch schedule", error);
    Swal.fire('Error', 'Gagal memuat jadwal. Periksa koneksi atau coba lagi nanti.', 'error');
  } finally {
    setIsLoading(false);
    if (!isDataFound && isOpen) {
      setTimeout(() => {
        Swal.fire({
          title: 'Informasi',
          text: 'Jadwal untuk bulan ini belum tersedia atau masih kosong.',
          icon: 'info',
          timer: 3000,
          showConfirmButton: false,
        });
      }, 500);
    }
  }
};

  useEffect(() => {
    if (employee && isOpen) {
      const initialDate = new Date();
      setCurrentDate(initialDate);
      fetchSchedule(employee.userId, initialDate);
    } else if (!isOpen) {
      setEvents([]);
      setInitialEvents([]);
    }
  }, [employee, isOpen]);

  const hasChanges = JSON.stringify(events) !== JSON.stringify(initialEvents);

  const handleDayOrEventClick = async (arg: DateClickArg | EventClickArg) => {
    const dateStr = 'dateStr' in arg ? arg.dateStr : arg.event.startStr;
    const currentEvent = events.find(e => e.start === dateStr);
    const currentStatus = currentEvent?.title || ''; // Default ke string kosong jika undefined

    const { value: newStatus } = await Swal.fire({
      title: `Ubah Jadwal ${new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`,
      input: 'select',
      inputOptions: {
        'WFO': 'WFO (Work From Office)',
        'WFH': 'WFH (Work From Home)',
        'OFF': 'OFF (Hari Libur)'
      },
      inputValue: currentStatus,
      inputPlaceholder: 'Pilih status baru...',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ubah',
    });

    // Hanya lanjutkan jika newStatus adalah string yang valid (WFO, WFH, OFF) dan berbeda dari status sebelumnya.
    if (newStatus && typeof newStatus === 'string' && newStatus !== currentStatus) {
      setEvents(prevEvents => {
        const eventIndex = prevEvents.findIndex(e => e.start === dateStr);
        const updatedEvents = [...prevEvents];

        if (eventIndex > -1) {
          // Pastikan untuk membuat objek baru yang lengkap untuk konsistensi
          updatedEvents[eventIndex] = {
            start: dateStr,
            title: newStatus as DayStatus,
            allDay: true,
            color: STATUS_COLORS[newStatus as DayStatus]
          };
        } else {
          updatedEvents.push({ title: newStatus as DayStatus, start: dateStr, allDay: true, color: STATUS_COLORS[newStatus as DayStatus] });
        }
        return updatedEvents;
      });
    }
  };

  const handleSave = async () => {
    if (!employee) return;
    setIsSaving(true);
    try {
      const payload = {
        schedules: events.map(e => ({
          user_id: employee.userId,
          date: e.start,
          work_status: e.title,
        })),
      };
      await api.put('/v1/schedule/update-batch', payload);

      Swal.fire({
        title: 'Berhasil!',
        text: 'Jadwal berhasil diperbarui.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        onClose();
      });

    } catch (error) {
      console.error("Failed to save schedule", error);
      Swal.fire('Gagal!', 'Gagal menyimpan jadwal. Silakan coba lagi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges && !isSaving) {      
      Swal.fire({
        title: 'Perubahan Belum Disimpan',
        text: "Apakah Anda yakin ingin keluar? Perubahan yang Anda buat akan hilang.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, keluar',
        cancelButtonText: 'Batal'
      }).then(result => {
        if (result.isConfirmed) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={handleClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  <span>Edit Jadwal: {employee?.name}</span>
                  <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  <div className="flex items-center gap-4 mb-3 text-xs">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: STATUS_COLORS.WFO}}></span> WFO</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: STATUS_COLORS.WFH}}></span> WFH</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: STATUS_COLORS.OFF}}></span> OFF</div>
                  </div>
                  
                  {isLoading ? (
                     <div className="flex items-center justify-center h-96 text-gray-500">
                        <ArrowPathIcon className="w-6 h-6 animate-spin mr-3" />
                        Memuat jadwal...
                      </div>
                  ) : (
                    <FullCalendar
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      locale={idLocale}
                      events={events}
                      initialDate={currentDate}
                      dateClick={handleDayOrEventClick}
                      eventClick={handleDayOrEventClick}
                      datesSet={(dateInfo) => {
                        const newDate = dateInfo.view.currentStart;
                        if (newDate.getMonth() !== currentDate.getMonth() || newDate.getFullYear() !== currentDate.getFullYear()) {
                          setCurrentDate(newDate);
                          if(employee) fetchSchedule(employee.userId, newDate);
                        }
                      }}
                      headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                      height="auto"
                    />
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div>
                    {hasChanges && (
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <ExclamationTriangleIcon className="w-5 h-5"/>
                        <span>Perubahan belum disimpan</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200" onClick={handleClose}>
                      Batal
                    </button>
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed" onClick={handleSave} disabled={isSaving || !hasChanges}>
                      {isSaving && <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />}
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}