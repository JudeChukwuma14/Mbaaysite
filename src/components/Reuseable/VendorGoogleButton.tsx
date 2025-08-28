import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const VendorGoogleButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showGoogleButton, setShowGoogleButton] = useState<boolean>(false);
    const navigate = useNavigate();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const handleGoogleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Show the Google button temporarily
        setShowGoogleButton(true);
    };

    useEffect(() => {
        if (showGoogleButton) {
            // Click the Google button after a short delay to ensure it's rendered
            const timer = setTimeout(() => {
                const googleButton = document.querySelector('div[role="button"][aria-labelledby="button-label"]');
                if (googleButton) {
                    (googleButton as HTMLElement).click();
                }
                // Hide the Google button after attempting to click
                setShowGoogleButton(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [showGoogleButton]);

    return (
        <div className="w-full">
            {/* Google Login button - conditionally rendered */}
            {showGoogleButton && (
                <div ref={googleButtonRef} className="fixed top-0 left-0 opacity-0">
                    <GoogleLogin
                        onSuccess={async (credentialResponse: CredentialResponse) => {
                            try {
                                setIsLoading(true);
                                const idToken = credentialResponse.credential;
                                
                                // Use the VENDOR endpoint
                                const response = await axios.post(
                                    "https://mbayy-be.onrender.com/api/v1/vendor/google-verify",
                                    { token: idToken },
                                    { headers: { "Content-Type": "application/json" } }
                                );
                                
                                const { data } = response;
                                
                                if (response.status === 200) {
                                    if (data.token) {
                                        // Existing vendor - log them in
                                        localStorage.setItem("authToken", data.token);
                                        localStorage.setItem("accountType", "vendor");
                                        localStorage.setItem("vendorData", JSON.stringify(data.vendor));
                                        toast.success(data.message || "Vendor login successful");
                                        navigate("/vendor-dashboard");
                                    } else if (data.tempToken) {
                                        // New vendor - redirect to complete profile
                                        localStorage.setItem("tempToken", data.tempToken);
                                        toast.info(data.message || "Complete your vendor profile");
                                        navigate("/complete-signup", { state: data.user });
                                    }
                                } else {
                                    toast.error(data.message || "Google verification failed");
                                }
                            } catch (err: any) {
                                toast.error(
                                    err.response?.data?.message || "Error verifying Google login",
                                    {
                                        position: "top-right",
                                        autoClose: 3000,
                                    }
                                );
                                console.error("Google verification error:", err);
                            } finally {
                                setIsLoading(false);
                                setShowGoogleButton(false);
                            }
                        }}
                        onError={() => {
                            toast.error("Google Sign-In failed", {
                                position: "top-right",
                                autoClose: 3000,
                            });
                            setShowGoogleButton(false);
                        }}
                        useOneTap={false}
                        auto_select={false}
                    />
                </div>
            )}

            {/* Your custom button */}
            <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                type="button"
                className="flex items-center justify-center w-full p-3 font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-orange-500 hover:ring-2 hover:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
                        Signing in...
                    </div>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign up with Google
                    </>
                )}
            </button>
        </div>
    );
};