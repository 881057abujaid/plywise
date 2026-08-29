import plywiseMark from "../../assets/brand/plywise-mark.png";

const MARK_SIZES = {
    sm: 28,
    md: 40,
    lg: 70,
};

const Logo = ({ variant = "full", size = "md", className = "" }) => {
    const markSize = MARK_SIZES[size] ?? MARK_SIZES.md;

    if (variant === "mark") {
        return (
            <img
                src={plywiseMark}
                alt="PlyWise"
                width={markSize}
                height={markSize}
                className={`object-contain ${className}`}
            />
        );
    }

    if (variant === "wordmark") {
        return (
            <span className={`font-display font-bold tracking-[0.04em] text-text-primary ${className}`}>
                PLYWISE
            </span>
        );
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src={plywiseMark}
                alt=""
                width={markSize}
                height={markSize}
            />

            <span className="font-display font-bold tracking-[0.04em] text-text-primary">
                PLYWISE
            </span>
        </div>
    );
};

export default Logo;