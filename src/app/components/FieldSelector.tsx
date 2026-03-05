import { Settings } from 'lucide-react';
import { useState } from 'react';

interface Field {
  key: string;
  label: string;
  enabled: boolean;
}

interface FieldSelectorProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
}

export default function FieldSelector({ fields, onFieldsChange }: FieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleField = (key: string) => {
    const updatedFields = fields.map(field =>
      field.key === key ? { ...field, enabled: !field.enabled } : field
    );
    onFieldsChange(updatedFields);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
      >
        <Settings className="w-4 h-4" />
        <span>Select Fields</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className="font-medium text-slate-900 dark:text-white">Display Fields</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Choose which columns to show</p>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {fields.map(field => (
                <label
                  key={field.key}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    onChange={() => toggleField(field.key)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:bg-slate-700"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}