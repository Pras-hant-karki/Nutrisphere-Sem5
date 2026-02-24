import React from "react";

export interface AppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          h-[var(--input-h)]
          w-full
          bg-[var(--bg-input)]
          border border-[var(--border)]
          rounded-[var(--radius-lg)]
          px-4
          text-[14px]
          text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          outline-none
          transition
          focus:border-[var(--gold)]
          ${className}
        `}
      />
    );
  }
);

AppInput.displayName = "AppInput";
export default AppInput;
