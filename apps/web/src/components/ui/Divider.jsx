const Divider = ({ label, className = "" }) => {
    if (!label) {
        return (
            <div
                role="separator"
                className={`h-px w-full bg-border ${className}`}
            />
        );
    }

    return (
        <div
            role="separator"
            className={`flex w-full items-center gap-3 ${className}`}
        >
            <span className="h-px flex-1 bg-border" />
            <span className="shrink-0 text-sm font-medium uppercase tracking-wide text-text-muted">
                {label}
            </span>
            <span className="h-px flex-1 bg-border" />
        </div>
    );
};

export default Divider;