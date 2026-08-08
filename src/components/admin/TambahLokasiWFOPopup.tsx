import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
      Memuat peta...
    </div>
  ),
});

interface TambahLokasiWFOPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // editingLocation?: OfficeLocation | null;
}

interface OfficeLocation {
  id?: string;
  name: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // Note: sesuai API field 'radius'
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface OfficeLocationCreate {
  name: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface OfficeLocationResponse {
  id: string;
  name: string;
  capacity: number;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GPSValidationResponse {
  is_valid: boolean;
  distance_meters: number;
  is_within_radius: boolean;
  details: {
    calculation_method: string;
    calculation_time_ms: number;
    earth_radius_used: number;
    bearing_degrees?: number;
  };
  timestamp: string;
}

// Helper function untuk mendapatkan auth token
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

export default function TambahLokasiWFOPopup({
  isOpen,
  onClose,
  onSuccess,
  // editingLocation = null,
}: TambahLokasiWFOPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    address: "",
    latitude: "",
    longitude: "",
    radius: "100",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<GPSValidationResponse | null>(null);
  const [existingLocations, setExistingLocations] = useState<OfficeLocation[]>(
    [],
  );
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | null>(
    null,
  );

  // Load existing locations on open
  useEffect(() => {
    if (isOpen) {
      loadExistingLocations();
    }
  }, [isOpen]);

  // Pre-fill form if editing
  useEffect(() => {
    if (!isOpen) return;
    
    if (editingLocation && isOpen) {
      setFormData({
        name: editingLocation.name,
        capacity: editingLocation.capacity.toString(),
        address: editingLocation.address,
        latitude: editingLocation.latitude.toString(),
        longitude: editingLocation.longitude.toString(),
        radius: editingLocation.radius.toString(),
      });
    } else if (isOpen) {
      // Reset form for new location
      setFormData({
        name: "",
        capacity: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "100",
      });
    }
  }, [editingLocation, isOpen]);

  const loadExistingLocations = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setExistingLocations(data);
      } else if (response.status === 401) {
        setError("Session expired. Please login again.");
      }
    } catch (err) {
      console.error("Failed to load locations:", err);
    }
  };

  // const handleMapLocationSelect = (lat: number, lng: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     latitude: lat.toFixed(6),
  //     longitude: lng.toFixed(6),
  //   }));
  //   setError(null);
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateCoordinates = async (): Promise<boolean> => {
    if (!formData.latitude || !formData.longitude) {
      setError("Koordinat GPS harus diisi");
      return false;
    }

    try {
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        setError("Latitude harus antara -90 sampai 90");
        return false;
      }

      if (isNaN(lon) || lon < -180 || lon > 180) {
        setError("Longitude harus antara -180 sampai 180");
        return false;
      }

      return true;
    } catch (err) {
      setError("Format koordinat tidak valid");
      return false;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Nama lokasi harus diisi");
      return false;
    }

    if (!formData.address.trim()) {
      setError("Alamat lengkap harus diisi");
      return false;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setError("Kapasitas harus berupa angka positif");
      return false;
    }

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError("Latitude harus antara -90 sampai 90");
      return false;
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      setError("Longitude harus antara -180 sampai 180");
      return false;
    }

    const radius = parseInt(formData.radius);
    if (isNaN(radius) || radius < 50 || radius > 300) {
      setError("Radius harus antara 50-300 meter");
      return false;
    }

    return true;
  };

  // ========== GPS VALIDATION API FUNCTIONS ==========
  const testGPSValidation = async () => {
    if (!(await validateCoordinates())) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      // Validasi dengan API GPS
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gps/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_latitude: parseFloat(formData.latitude),
            user_longitude: parseFloat(formData.longitude),
            office_latitude: -6.917464, // Contoh koordinat kantor pusat
            office_longitude: 107.619125,
            radius_meters: parseInt(formData.radius),
            use_geopy: false,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const data: GPSValidationResponse = await response.json();
      setValidationResult(data);

      // if (data.is_within_radius) {
      //   alert('✅ GPS valid! Lokasi berada dalam radius yang ditentukan.')
      // } else {
      //   alert('⚠️ GPS valid, tetapi lokasi berada di luar radius yang ditentukan.')
      // }
      if (data.is_within_radius) {
        Swal.fire({
          icon: "success",
          title: "GPS Valid",
          text: "Lokasi berada dalam radius yang ditentukan",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Di Luar Radius",
          text: "Lokasi valid, tetapi berada di luar radius yang ditentukan",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat validasi GPS",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = async () => {
    if (!(await validateCoordinates())) return;

    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gps/distance?` +
          `lat1=${formData.latitude}` +
          `&lon1=${formData.longitude}` +
          `&lat2=-6.917464` + // Contoh kantor pusat
          `&lon2=107.619125` +
          `&method=haversine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      // alert(`Jarak ke kantor pusat: ${(data.distance_meters / 1000).toFixed(2)} km`)
      Swal.fire({
        icon: "info",
        title: "Hasil Perhitungan Jarak",
        text: `Jarak ke kantor pusat: ${(data.distance_meters / 1000).toFixed(2)} km`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghitung jarak",
      );
    } finally {
      setLoading(false);
    }
  };

  const getTestCoordinates = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gps/test-coordinates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Gunakan contoh koordinat dari API
      const exampleOffice = data.example_offices?.[0];
      if (exampleOffice) {
        setFormData((prev) => ({
          ...prev,
          name: exampleOffice.name,
          latitude: exampleOffice.latitude.toString(),
          longitude: exampleOffice.longitude.toString(),
          radius: exampleOffice.radius.toString(),
          address: exampleOffice.address,
          capacity: "30",
        }));
        // alert('Contoh koordinat telah dimuat dari API')
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Contoh koordinat telah dimuat dari API",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil contoh koordinat",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Anda harus login terlebih dahulu");
        return;
      }

      const locationData: OfficeLocationCreate = {
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
        address: formData.address.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius: parseInt(formData.radius),
      };

      let response: Response;
      let url: string;

      if (editingLocation?.id) {
        // Update existing location
        url = `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/locations/${editingLocation.id}`;
        response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationData),
        });
      } else {
        // Create new location
        url = `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/locations`;
        response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(locationData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      // Reset form
      setFormData({
        name: "",
        capacity: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "100",
      });

      setValidationResult(null);
      setEditingLocation(null);

      // Refresh locations list
      await loadExistingLocations();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();

      // Show success message
      // alert(`✅ Lokasi ${editingLocation?.id ? 'diperbarui' : 'ditambahkan'} berhasil!`)
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Lokasi berhasil ${editingLocation?.id ? "diperbarui" : "ditambahkan"}`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
      setError(errorMessage);
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setError(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        { headers: { "Accept-Language": "id" } },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          setFormData((prev) => ({ ...prev, address: data.display_name }));
        }
      }
    } catch {
      // silent fail, biar user isi manual kalau reverse geocoding gagal
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    // if (!confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) return
    const result = await Swal.fire({
      title: "Hapus Lokasi?",
      text: "Lokasi yang dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/schedule/locations/${locationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        // alert('✅ Lokasi berhasil dihapus!')
        Swal.fire({
          icon: "success",
          title: "Dihapus",
          text: "Lokasi berhasil dihapus",
        });
        await loadExistingLocations(); // Refresh list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal menghapus lokasi");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus lokasi");
    }
  };

  const handleEditLocation = (location: OfficeLocation) => {
    setEditingLocation(location);
    // Pre-fill form dengan data lokasi yang dipilih
    setFormData({
      name: location.name,
      capacity: location.capacity.toString(),
      address: location.address,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius: location.radius.toString(),
    });

    setError(null);
    setValidationResult(null);

    // Scroll to top of form
    setTimeout(() => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 100);
  };

  // Filter hanya lokasi aktif
  const activeLocations = existingLocations.filter(
    (loc) => loc.is_active !== false,
  );
  const locationsToShow = showAllLocations
    ? activeLocations
    : activeLocations.slice(0, 3);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={isSubmitting || loading ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold text-gray-900"
                      >
                        {editingLocation?.id
                          ? "Edit Lokasi WFO"
                          : "Tambah Lokasi WFO Baru"}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mt-1">
                        {editingLocation?.id
                          ? "Perbarui lokasi kantor"
                          : "Atur lokasi untuk Work From Office"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onClose}
                      disabled={isSubmitting || loading}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-6 modal-content">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {validationResult && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Hasil Validasi GPS
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Jarak: {validationResult.distance_meters.toFixed(2)}
                            m
                            {validationResult.is_within_radius
                              ? " ✅ Dalam radius"
                              : " ❌ Di luar radius"}
                          </p>
                        </div>
                        <button
                          onClick={() => setValidationResult(null)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <div className="space-y-6">
                    {/* Nama Lokasi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lokasi *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                        placeholder="Masukkan nama lokasi"
                        disabled={isSubmitting || loading}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Contoh: Kantor Pusat Antapani
                      </p>
                    </div>

                    {/* Kapasitas Maksimal */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kapasitas Maksimal (orang) *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                        placeholder="Masukkan kapasitas maksimal"
                        min="1"
                        disabled={isSubmitting || loading}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Jumlah maksimal karyawan yang dapat bekerja di lokasi
                        ini
                      </p>
                    </div>

                    {/* Alamat Lengkap */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                        placeholder="Masukkan alamat lengkap"
                        disabled={isSubmitting || loading}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Gunakan alamat lengkap untuk identifikasi manual
                      </p>
                    </div>
                    {/* Pilih Lokasi via Peta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Lokasi di Peta
                      </label>
                      <LocationPickerMap
                        latitude={parseFloat(formData.latitude) || -6.917464}
                        longitude={parseFloat(formData.longitude) || 107.619125}
                        onLocationSelect={handleMapLocationSelect}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Klik pada peta atau geser marker untuk mengatur titik
                        lokasi kantor
                      </p>
                    </div>
                    {/* Koordinat GPS */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Koordinat GPS *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Latitude
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                              placeholder="-6.917464"
                              disabled={isSubmitting || loading}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                              -90 to 90
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Longitude
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="longitude"
                              value={formData.longitude}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                              placeholder="107.619125"
                              disabled={isSubmitting || loading}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                              -180 to 180
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GPS Tools */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={testGPSValidation}
                        disabled={
                          isSubmitting ||
                          loading ||
                          !formData.latitude ||
                          !formData.longitude
                        }
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Memvalidasi..." : "Test Validasi GPS"}
                      </button>
                      <button
                        type="button"
                        onClick={calculateDistance}
                        disabled={
                          isSubmitting ||
                          loading ||
                          !formData.latitude ||
                          !formData.longitude
                        }
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hitung Jarak
                      </button>
                      <button
                        type="button"
                        onClick={getTestCoordinates}
                        disabled={isSubmitting || loading}
                        className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Contoh Koordinat
                      </button>
                    </div>

                    {/* Radius Check-in */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Radius Check-in (Meter) *
                        </label>
                        <span className="text-sm font-medium text-gray-700">
                          {formData.radius}m
                        </span>
                      </div>
                      <input
                        type="range"
                        name="radius"
                        min="50"
                        max="300"
                        step="10"
                        value={formData.radius}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        disabled={isSubmitting || loading}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>50m</span>
                        <span>
                          Jarak maksimal untuk check-in (50-300 meter)
                        </span>
                        <span>300m</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-gray-200" />

                  {/* Daftar Lokasi yang Ada */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Lokasi yang Telah Ada
                      </h4>
                      {activeLocations.length > 3 && (
                        <button
                          onClick={() => setShowAllLocations(!showAllLocations)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {showAllLocations
                            ? "Tampilkan Sedikit"
                            : `Lihat Semua (${activeLocations.length})`}
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {activeLocations.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Belum ada lokasi yang terdaftar
                        </p>
                      ) : (
                        locationsToShow.map((location) => (
                          <div
                            key={location.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <MapPinIcon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {location.name}
                                  </h5>
                                  <p className="text-xs text-gray-600 mt-1 truncate max-w-md">
                                    {location.address}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span>
                                      Kapasitas: {location.capacity} orang
                                    </span>
                                    <span>Radius: {location.radius}m</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    GPS: {location.latitude.toFixed(6)},{" "}
                                    {location.longitude.toFixed(6)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={() => handleEditLocation(location)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50"
                                  disabled={isSubmitting || loading}
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    location.id &&
                                    handleDeleteLocation(location.id)
                                  }
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
                                  disabled={isSubmitting || loading}
                                  title="Hapus"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {(isSubmitting || loading) && (
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        {isSubmitting
                          ? editingLocation?.id
                            ? "Memperbarui..."
                            : "Menyimpan..."
                          : "Memproses..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting || loading}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || loading}
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting
                        ? editingLocation?.id
                          ? "Memperbarui..."
                          : "Menyimpan..."
                        : editingLocation?.id
                          ? "Perbarui Lokasi"
                          : "Simpan Lokasi"}
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
