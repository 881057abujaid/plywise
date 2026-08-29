import { Logo } from "../ui";

const AuthLayout = ({ children, className = "" }) => {
    return (
        <main
            className={`
                relative flex min-h-screen w-full items-center justify-center
                overflow-hidden bg-bg px-4 py-10
                ${className}
            `}
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    bg-[radial-gradient(circle_at_center,rgba(212,168,79,0.06),transparent_45%)]
                "
            />

            <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
                <div className="flex flex-col items-center">
                    <Logo variant="mark" size="lg" />

                    <span className="mt-2 font-display text-3xl font-bold tracking-[0.04em] text-gold-primary">
                        PLYWISE
                    </span>
                </div>

                <div className="mt-8 w-full">
                    {children}
                </div>
            </div>
        </main>
    );
};

export default AuthLayout;