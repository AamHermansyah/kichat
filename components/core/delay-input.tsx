import React, { useEffect, useMemo, ChangeEvent, FC } from 'react';
import _ from 'lodash';

interface DelayedInputProps {
  placeholder: string;
  onChange: (value: string) => void;
}

const DelayedInput: FC<DelayedInputProps> = ({ placeholder, onChange }) => {
  const debouncedResults = useMemo(() => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    return _.debounce(handleChange, 500);
  }, [onChange]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  }, [debouncedResults]);

  return (
    <div>
      <input
        onChange={debouncedResults}
        placeholder={placeholder}
        className="
          form-input
          block
          w-full
          rounded-md
          border-0
          py-1.5
          text-gray-800
          shadow
          ring-1
          ring-gray-300
          placeholder:text-gray-400
          focus:ring-2
          focus:ring-purple-600
          sm:text-sm
          sm:leading-6
        "
      />
    </div>
  );
};

export default DelayedInput;