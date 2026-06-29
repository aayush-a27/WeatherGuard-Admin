import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { updateCity, detectCity } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';

/**
 * Card for setting the user's preferred city — manually or via browser geolocation.
 */
export default function CityCard({ user }) {
  const { updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: user?.city || '',
    },
  });

  const hasCity = !!user?.city;

  /**
   * Manually set city from the form input.
   */
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      const updatedUser = await updateCity(data.city);
      updateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Auto-detect city using the browser's Geolocation API.
   */
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const updatedUser = await detectCity(latitude, longitude);
          updateUser(updatedUser);
          setValue('city', updatedUser.city || '');
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setDetecting(false);
        }
      },
      (geoError) => {
        setDetecting(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError(
              'Location permission denied. Please allow location access in your browser settings.'
            );
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case geoError.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while detecting your location.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <Card className="animate-slide-up animate-delay-300">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            hasCity
              ? 'bg-sky-100 dark:bg-sky-900/30'
              : 'bg-gray-100 dark:bg-surface-800'
          }`}
        >
          <HiOutlineMapPin
            className={`w-5 h-5 ${
              hasCity
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Weather City
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {hasCity ? `Current: ${user.city}` : 'Not set — using default'}
          </p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            City updated to{' '}
            <span className="font-bold">{user?.city}</span>!
          </p>
        </div>
      )}

      {/* Auto-detect button */}
      <Button
        type="button"
        variant="outline"
        className="w-full mb-4"
        loading={detecting}
        onClick={handleDetectLocation}
        icon={HiOutlineGlobeAlt}
      >
        {detecting ? 'Detecting location...' : 'Auto-detect my city'}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200 dark:bg-surface-700" />
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          OR
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-surface-700" />
      </div>

      {/* Manual city form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register('city', {
              required: 'City name is required',
              maxLength: {
                value: 100,
                message: 'City name is too long',
              },
            })}
            placeholder="Enter city name (e.g., Mumbai, Delhi)"
            className="input-field"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.city.message}
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" loading={submitting} className="w-full">
          Set City Manually
        </Button>
      </form>
    </Card>
  );
}
