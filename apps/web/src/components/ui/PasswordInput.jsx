import { useState } from "react";
import Input from "./Input";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
    label = "Password",
    id = "password",
    className = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                label={label}
                type={showPassword ? "text" : "password"}
                className={`pr-12 ${className}`}
                {...props}
            />

            <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                    absolute right-3 top-[2.15rem]
                    inline-flex h-8 w-8 items-center justify-center
                    rounded-md text-text-muted
                    transition-colors duration-150
                    hoverL:text-text-primary
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-gold-primary
                "
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
};

export default PasswordInput;