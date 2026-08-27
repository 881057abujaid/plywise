const Input = ({
    label,
    id,
    error,
    helperText,
    className = "",
    ...props
}) => {
    const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

    return (
        <div className="flex w-full flex-col gap-2">
            {label && (
                <label
                    htmlFor={id}
                    className="font-sans text-sm font-medium text-text-secondary"
                >
                    {label}
                </label>
            )}

            <input
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={`
                    h-11 w-full rounded-md border bg-surface px-3
                    font-sans text-base text-text-primary
                    placeholder:text-text-muted
                    outline-none transition-all duration-200
                    ${error
                        ? "border-danger focus:border-danger focus-ring-2 focus:ring-danger/20"
                        : "border-border focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20"
                    }
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p
                    id={`${id}-error`}
                    className="text-sm text-danger"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p
                    id={`${id}-helper`}
                    className="text-sm text-text-muted"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Input;