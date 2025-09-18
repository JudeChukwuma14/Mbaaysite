// // DashboardPaymentHandler.tsx
// import { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { verifySubscriptionPayment } from "@/utils/upgradeApi";
// import { useQueryClient } from "@tanstack/react-query";

// export default function DashboardPaymentHandler() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const handlePaymentVerification = async () => {
//       const reference = searchParams.get("reference");
//       const trxref = searchParams.get("trxref");
//       const paymentReference = reference || trxref;

//       if (!paymentReference) return;

//       try {
//         // Remove the reference from URL to prevent re-triggering
//         const newUrl = window.location.pathname;
//         window.history.replaceState({}, "", newUrl);

//         const data = await verifySubscriptionPayment(paymentReference);
//         console.log("data" + data);

//         if (data.success) {
//           toast.success("Payment confirmed! Your plan has been upgraded.");

//           // Invalidate queries to refresh vendor data
//           queryClient.invalidateQueries({ queryKey: ["vendor"] });
//           queryClient.invalidateQueries({ queryKey: ["subscription"] });

//           // Show success modal or redirect to success page within dashboard
//           navigate("/app/subscription/success", {
//             state: {
//               plan: data.newPlan,
//               ref: paymentReference,
//               billing: data.billing,
//               amount: data.amount,
//             },
//             replace: true,
//           });
//         } else {
//           toast.error(data.message || "Payment verification failed");
//           navigate("/app/subscription/failed", {
//             state: {
//               plan: data.newPlan,
//               ref: paymentReference,
//               billing: data.billing,
//               amount: data.amount,
//             },
//             replace: true,
//           });
//         }
//       } catch (error: any) {
//         console.error("Payment verification error:", error);
//         toast.error(
//           error?.response?.data?.message || "Payment verification failed"
//         );
//         navigate("/app/pricing", { replace: true });
//       }
//     };

//     handlePaymentVerification();
//   }, [searchParams, navigate, queryClient]);

//   return null;
// }
