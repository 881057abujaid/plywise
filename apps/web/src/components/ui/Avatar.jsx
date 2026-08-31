const Avatar = ({
    src,
    alt = "",
    name = "",
    size = "md",
    className = "",
}) => {
    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-ms",
        lg: "h-14 w-14 text-lg",
        xl: "h-20 w-20 text-2xl",
    };

    const initials = name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join()
        .slice(0, 2)
        .toUpperCase();
    return (
        <div className={`
            flex shrink-0 items-center justify-center
            overflow-hidden rounded-full
            border border-border
            bg-surface-elevated
            font-sans font-medium
            text-text-secondary
            ${sizes[size] ?? sizes.md}
            ${className}    
        `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials || "?"
            )}
        </div>
    );
};

export default Avatar;