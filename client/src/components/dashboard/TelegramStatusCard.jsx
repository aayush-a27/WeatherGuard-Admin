import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlinePaperAirplane, HiOutlineCheckCircle, HiOutlineLink } from 'react-icons/hi2';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { connectTelegram } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';

/**
 * Card showing Telegram connection status and a form to connect.
 */
export default function TelegramStatusCard({ user }) {
  const { updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isConnected = !!user?.telegramChatId;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      const updatedUser = await connectTelegram(data.telegramChatId);
      updateUser(updatedUser);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="animate-slide-up animate-delay-200">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isConnected
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-gray-100 dark:bg-surface-800'
          }`}
        >
          <HiOutlinePaperAirplane
            className={`w-5 h-5 ${
              isConnected
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Telegram Bot
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Not connected'}
          </p>
        </div>
      </div>

      {isConnected || success ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Telegram connected successfully!
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
              Chat ID: {user?.telegramChatId}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Instructions */}
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 mb-4">
            <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-2 flex items-center gap-1.5">
              <HiOutlineLink className="w-4 h-4" />
              How to connect:
            </h4>
            <ol className="text-xs text-brand-600 dark:text-brand-400 space-y-1 list-decimal list-inside">
              <li>
                Open Telegram and search for{' '}
                <span className="font-mono font-semibold">@WeatherGuardBot</span>
              </li>
              <li>
                Send <span className="font-mono font-semibold">/start</span> to the bot
              </li>
              <li>Copy the Chat ID the bot sends you</li>
              <li>Paste it below and click Connect</li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <input
                {...register('telegramChatId', {
                  required: 'Chat ID is required',
                  pattern: {
                    value: /^-?\d+$/,
                    message: 'Please enter a valid numeric Chat ID',
                  },
                })}
                placeholder="Enter your Telegram Chat ID"
                className="input-field"
              />
              {errors.telegramChatId && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.telegramChatId.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" loading={submitting} className="w-full">
              Connect Telegram
            </Button>
          </form>
        </>
      )}
    </Card>
  );
}
