const Card = ({
    children,
    variant = "default",
    padding = "md",
    className = "",
    ...props
}) => {
    const variants = {
        default: "border border-border bg-surface shadow-md",
        elevated: "border border-border bg-surface-elevated shadow-lg",
        flat: "bg-surface",
    };

    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={`
                rounded-lg
                ${variants[variant] ?? variants.default}
                ${paddings[padding] ?? paddings.md}
                ${className}    
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;