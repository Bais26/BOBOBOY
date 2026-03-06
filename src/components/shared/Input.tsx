interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'tel' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  error,
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}