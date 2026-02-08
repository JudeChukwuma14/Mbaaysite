import React, { useState, useEffect, useRef } from "react";
import {
  FiPhone,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { FaPaperPlane, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface ContactInfo {
  type: "phone" | "email" | "whatsapp" | "location";
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_l7miiua",
  TEMPLATE_ID: "template_6jd1bdd",
  PUBLIC_KEY: "ciULL1p5WE51ZzGy9",
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [characterCount, setCharacterCount] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const contactInfo: ContactInfo[] = [
    {
      type: "phone",
      title: "Call To Us",
      value: "+88016111112222",
      description: "We are available 24/7, 7 days a week to assist you.",
      icon: <FiPhone className="w-6 h-6 text-orange-600" />,
      link: "tel:+88016111112222",
    },
    {
      type: "whatsapp",
      title: "WhatsApp",
      value: "+88016111113333",
      description: "Chat with us on WhatsApp for quick responses.",
      icon: <FaWhatsapp className="w-6 h-6 text-green-600" />,
      link: "https://wa.me/88016111113333",
    },
    {
      type: "email",
      title: "Write To Us",
      value: "support@mbaay.com",
      description: "Fill out our form and we will contact you within 24 hours.",
      icon: <FiMail className="w-6 h-6 text-orange-600" />,
      link: "mailto:support@mbaay.com",
    },
    {
      type: "location",
      title: "Visit Us",
      value: "Dhaka, Bangladesh",
      description: "Schedule a visit to our office location.",
      icon: <FaMapMarkerAlt className="w-6 h-6 text-red-600" />,
    },
  ];

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Update character count for message
    if (name === "message") {
      setCharacterCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Prepare EmailJS template parameters
      const templateParams = {
        to_name: "MBA Support Team", // Receiver's name
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY,
      );

      setSubmitStatus("success");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setCharacterCount(0);
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");

      // Auto-retry logic (optional)
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactClick = (info: ContactInfo) => {
    if (info.link) {
      if (info.type === "email" || info.type === "phone") {
        window.location.href = info.link;
      } else {
        window.open(info.link, "_blank", "noopener,noreferrer");
      }
    }
  };

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [formData.message]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get In <span className="text-orange-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond
            within 2 hours.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {/* Contact Information Cards */}
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <motion.div
                key={info.type}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-orange-200"
                onClick={() => handleContactClick(info)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        info.type === "whatsapp"
                          ? "bg-green-50"
                          : info.type === "location"
                            ? "bg-red-50"
                            : "bg-orange-50"
                      }`}
                    >
                      {info.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {info.description}
                    </p>
                    <p
                      className={`font-semibold ${
                        info.type === "whatsapp"
                          ? "text-green-600"
                          : info.type === "location"
                            ? "text-red-600"
                            : "text-orange-600"
                      }`}
                    >
                      {info.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Send Your Message
                </h2>
                <p className="text-gray-600">
                  All fields marked with * are required
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We've received your message and
                    will respond within 2 hours.
                  </p>
                  <div className="bg-green-50 rounded-xl p-4 mb-6 max-w-md mx-auto">
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Confirmation:</span> A
                      copy has been sent to {formData.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  noValidate
                >
                  {/* Input Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        id: "name",
                        label: "Your Name *",
                        icon: <FiUser />,
                        type: "text",
                        placeholder: "John Doe",
                      },
                      {
                        id: "email",
                        label: "Your Email *",
                        icon: <FiMail />,
                        type: "email",
                        placeholder: "john@example.com",
                      },
                      {
                        id: "phone",
                        label: "Your Phone *",
                        icon: <FiPhone />,
                        type: "tel",
                        placeholder: "+88016111112222",
                      },
                      {
                        id: "subject",
                        label: "Subject *",
                        icon: null,
                        type: "text",
                        placeholder: "How can we help you?",
                      },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          {field.icon && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              {field.icon}
                            </div>
                          )}
                          <input
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            value={formData[field.id as keyof FormData]}
                            onChange={handleChange}
                            onFocus={() => setActiveField(field.id)}
                            onBlur={() => setActiveField(null)}
                            placeholder={field.placeholder}
                            className={`w-full ${field.icon ? "pl-10" : "pl-4"} pr-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                              errors[field.id as keyof FormErrors]
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                            } ${
                              activeField === field.id
                                ? "ring-2 ring-orange-200"
                                : ""
                            }`}
                            aria-invalid={
                              !!errors[field.id as keyof FormErrors]
                            }
                            aria-describedby={
                              errors[field.id as keyof FormErrors]
                                ? `${field.id}-error`
                                : undefined
                            }
                          />
                        </div>
                        {errors[field.id as keyof FormErrors] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            id={`${field.id}-error`}
                            className="text-sm text-red-600 flex items-center gap-1"
                          >
                            <FiAlertCircle className="w-4 h-4" />
                            {errors[field.id as keyof FormErrors]}
                          </motion.p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Your Message *
                      </label>
                      <span
                        className={`text-sm ${characterCount > 1000 ? "text-red-600" : characterCount > 800 ? "text-orange-500" : "text-gray-500"}`}
                      >
                        {characterCount}/1000
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField("message")}
                        onBlur={() => setActiveField(null)}
                        placeholder="Please describe your inquiry in detail..."
                        maxLength={1000}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                          errors.message
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                        } ${
                          activeField === "message"
                            ? "ring-2 ring-orange-200"
                            : ""
                        }`}
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                      />
                      {characterCount > 800 && characterCount <= 1000 && (
                        <div className="absolute bottom-2 right-2">
                          <div className="text-xs text-orange-500">
                            {1000 - characterCount} characters left
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="message-error"
                        className="text-sm text-red-600 flex items-center gap-1"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button with Status */}
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending via EmailJS...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FaPaperPlane className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                        </>
                      )}
                    </button>

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2 text-red-600 bg-red-50 py-4 rounded-xl text-center"
                      >
                        <FiAlertCircle className="w-6 h-6" />
                        <span className="font-medium">
                          Failed to send message
                        </span>
                        <p className="text-sm text-red-500">
                          Please try again or contact us directly via
                          email/phone.
                        </p>
                      </motion.div>
                    )}

                   

                    {/* Privacy Note */}
                    <p className="text-center text-sm text-gray-500">
                      By submitting this form, you agree to our{" "}
                      <a
                        href="/privacy"
                        className="text-orange-600 hover:text-orange-700 font-medium underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        className="text-orange-600 hover:text-orange-700 font-medium underline"
                      >
                        Terms of Service
                      </a>
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Map/Additional Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            If you don't receive a confirmation email within 5 minutes, please
            check your spam folder or contact us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleContactClick(contactInfo[0])}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FiPhone className="w-4 h-4" />
              Call Now
            </button>
            <button
              onClick={() => handleContactClick(contactInfo[1])}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-black transition-colors">
              Schedule Call
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
