"use client";
import React, { useState, forwardRef } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "outlined" | "filled" | "standard";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  showCharCount?: boolean;
  maxLength?: number;
  textareaClassName?: string; // adicionada corretamente
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "outlined",
      size = "md",
      fullWidth = true,
      resize = "vertical",
      showCharCount = false,
      maxLength,
      className = "",
      textareaClassName = "", // nova prop usada corretamente
      disabled = false,
      value = "",
      onChange,
      placeholder,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(String(value).length);

    const variants = {
      outlined:
        "border border-gray-600 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      filled:
        "bg-white text-black border-b-2 border-gray-300 placeholder-gray-500 focus:border-blue-500",
      standard:
        "border-b border-gray-300 bg-transparent text-black placeholder-gray-500 focus:border-blue-500",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base",
      lg: "px-5 py-4 text-base",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCharCount(newValue.length);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`${fullWidth ? "w-full" : "w-auto"} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
            w-full
            ${variants[variant]}
            ${sizes[size]}
            ${resizeClasses[resize]}
            ${textareaClassName} /* aplica classe personalizada */
            font-normal leading-[19px]
            transition-all duration-200 ease-in-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
            ${isFocused ? "ring-opacity-50" : ""}
          `}
            {...props}
          />
        </div>

        <div className="flex justify-between items-center mt-1">
          <div>
            {(error || helperText) && (
              <p
                className={`text-xs ${
                  error ? "text-red-500" : "text-gray-500"
                }`}
              >
                {error || helperText}
              </p>
            )}
          </div>

          {showCharCount && (
            <p
              className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
