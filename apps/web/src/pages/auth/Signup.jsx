import { useState } from "react";
import { Button, Card, Divider, Input, PasswordInput } from "../../components/ui";
import useAuthStore from "../../stores/auth.store";
import { signupSchema } from "../../schemas/auth.schema";
import { Link } from "react-router-dom";

const Signup = () => {
    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
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

        const result = signupSchema.safeParse(formData);

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
            await signup({
                email: formData.email,
                password: formData.password,
            });
        } catch (error) {
            setErrors({
                form: error.response?.data?.message || "Unable to create account.",
            });
        }
    };

    return (
        <Card padding="lg" className="w-full">
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-gold-primary">Create Account</h1>

                <p className="mt-2">Start your chess journey with playWise.</p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />

                {errors.form && (
                    <p className="text-sm text-danger">{errors.form}</p>
                )}

                <Button
                    type="submit"
                    className="mt-1 w-full"
                    disabled={isLoading}
                    loading={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create Account"}
                </Button>
            </form>

            <div className="my-6">
                <Divider label="OR" />
            </div>

            <p className="text-center text-sm">
                Already have an account?{" "}
                <Link
                    to="/auth/login"
                    className="
                        font-medium text-gold-primary
                        transition-colors duration-150
                        hover:text-gold-hover
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-gold-primary
                    "
                >
                    Sign in
                </Link>
            </p>
        </Card>
    );
};

export default Signup;