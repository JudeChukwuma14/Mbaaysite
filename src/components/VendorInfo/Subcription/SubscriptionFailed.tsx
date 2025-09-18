import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

interface LocationState {
  plan?: string;
  amount?: string;
  billing?: string;
  errorCode?: string;
  errorMessage?: string;
}

export default function SubscriptionFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useLocation() as { state: LocationState };
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(5);

  /* ---- defaults ---- */
  const plan = state?.plan || searchParams.get("plan") || "Unknown Plan";
  // const amount = state?.amount || searchParams.get("amount") || "$0.00";
  const billing = state?.billing || searchParams.get("billing") || "Monthly";
  const errorCode =
    state?.errorCode ||
    searchParams.get("errorCode") ||
    "ERR_SUBSCRIPTION_FAILED";
  const errorMessage =
    state?.errorMessage ||
    searchParams.get("errorMessage") ||
    "We couldn't process your subscription payment. Please try again or contact support.";

  /* ---- 5-second redirect ---- */
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      navigate("/app/pricing");
      localStorage.removeItem("plan");
    }
  }, [countdown, navigate]);

  const commonIssues = [
    {
      title: "Insufficient funds",
      description: "Your card doesn't have enough funds for this charge.",
    },
    {
      title: "Card verification failed",
      description: "CVV or billing address may be incorrect.",
    },
    {
      title: "Unusual activity detected",
      description: "Your bank flagged the transaction as unusual.",
    },
    {
      title: "Card expired or invalid",
      description:
        "Your card may be expired or the number was entered incorrectly.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 to-white">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="p-6 text-center bg-red-500">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full"
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white"
          >
            Subscription Failed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-red-100"
          >
            We couldn't process your payment
          </motion.p>
        </div>

        {/* Body */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 mb-6 border border-red-100 rounded-lg bg-red-50"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <div className="mb-1 text-sm font-medium text-red-800">
                  {errorCode}
                </div>
                <div className="text-sm text-red-600">{errorMessage}</div>
              </div>
            </div>
          </motion.div>

          <div className="mb-6">
            <div className="mb-1 text-sm text-gray-500">Plan</div>
            <div className="text-lg font-semibold text-gray-800">{plan}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-1 text-sm text-gray-500">Billing Cycle</div>
              <div className="text-gray-800">{billing}</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full py-3 text-left border-t border-b border-gray-100"
              aria-expanded={showDetails}
              aria-controls="common-issues"
            >
              <span className="font-medium text-gray-800">
                Common reasons for payment failure
              </span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showDetails && (
              <div id="common-issues" className="pt-3 pb-1 text-sm">
                <ul className="space-y-3">
                  {commonIssues.map((issue, index) => (
                    <li
                      key={index}
                      className="pb-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-800">
                        {issue.title}
                      </div>
                      <div className="mt-1 text-gray-600">
                        {issue.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <div className="pt-6 space-y-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/app/pricing"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                aria-label="Try payment again"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
              <Link
                to="/app/pricing"
                className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Change payment method"
              >
                Change Payment Method
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Return to home"
            >
              <Home className="w-4 h-4 mr-1" />
              Return to Home
            </Link>
            <div className="text-sm text-gray-500">
              Redirecting in <span className="font-medium">{countdown}s</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-md mt-6 text-sm text-center text-gray-500"
      >
        <p>
          Need immediate assistance?{" "}
          <Link
            to="/support"
            onClick={() => {
              localStorage.removeItem("plan");
            }}
            className="text-red-600 transition-colors hover:text-red-700"
          >
            Contact our support team
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
