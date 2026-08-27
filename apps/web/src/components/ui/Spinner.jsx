const Spinner = ({
    size = "md",
    className = "",
    label = "Loading",
}) => {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-2"
    };

    return (
        <span
            role="status"
            aria-label={label}
            className={`
                inline-block animate-spin rounded-full
                border-gold-primary border-t-transparent
                ${sizes[size] ?? sizes.md}
                ${className}
            `}
        >
            <span className="sr-only">{label}</span>
        </span>
    );
};

export default Spinner;