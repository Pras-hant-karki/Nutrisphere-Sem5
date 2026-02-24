import React from "react";

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  isLoading?: boolean;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    { children, fullWidth = false, isLoading = false, className = "", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={props.disabled || isLoading}
        className={`
          h-[var(--button-h)]
          ${fullWidth ? "w-full" : "px-6"}
          bg-[var(--primary)]
          text-white
          font-semibold
          font-[var(--font-display)]
          rounded-[var(--radius-lg)]
          transition
          hover:opacity-90
          active:scale-[0.98]
          disabled:opacity-50
          disabled:pointer-events-none
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.75"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
export default AppButton;
