const Button = ({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    type = "button",
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-sans font-medium rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-gold-primary text-bg hover:bg-gold-hover focus:visible:outline-gold-primary",
        secondary: "border border-border bg-surface text-text-primary hover:bg-surface-elevated focus-visible:outline-gold-primary",
        ghost: "text-text-secondary hover:bg-surface hover:text-text-primary focus-visible:outline-gold-primary",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-6 text-lg"
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rotate-full border-2 border-current border-t-transparent"
                />
            )}
            {children}
        </button>
    );
};

export default Button;