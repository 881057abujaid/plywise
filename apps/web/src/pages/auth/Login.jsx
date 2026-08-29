import { Button, Card, Divider, Input, PasswordInput } from "../../components/ui";
import useAuthStore from "../../stores/auth.store";
import { loginSchema } from "../../schemas/auth.schema";
import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((current) => ({
                ...current,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const nextErrors = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];

                if (field) {
                    nextErrors[field] = issue.message;
                }
            });

            setErrors(nextErrors);
            return;
        }

        setErrors({});
        try {
            await login(formData);
            console.log("Sign in successfull.");

            // Temporary success handling.
            // Navigation will be added with routing.
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "Unable to sign in.",
            });
        }
    };

    return (
        <Card className="w-full">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gold-primary">
                    Welcome Back
                </h1>

                <p className="mt-2">Continue your chess journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    onChange={handleChange}
                    value={formData.email}
                    error={errors.email}
                />

                <div>
                    <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        value={formData.password}
                        error={errors.password}
                    />

                    <div className="mt-2 text-right">
                        <button
                            type="button"
                            className="
                                text-sm font-medium text-gold-primary
                                transition-colors duration-150
                                hover:text-gold-hover
                            "
                        >
                            Forget password?
                        </button>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="mt-1 w-full"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </Button>
            </form>

            {errors.form && (
                <p className="text-sm text-danger">{errors.form}</p>
            )}

            <div className="my-6">
                <Divider label="OR" />
            </div>

            <p className="text-center text-sm">
                New to PlyWise?{" "}
                <Link
                    to="/auth/signup"
                    className="
                        font-medium text-gold-primary
                        transition-colors duration-150
                        hover:text-gold-hover
                        focus-visible:outline-none
                        focus-visible:ring-2 
                        focus-visible:ring-offset-2 
                        focus-visible:ring-gold-primary
                    "
                >
                    Create account
                </Link>
            </p>
        </Card>
    );
};

export default Login;