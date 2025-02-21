import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-10 text-center max-w-md w-full">
        {/* Success Icon */}
        <FaCheckCircle className="text-green-500 text-6xl mx-auto" />

        {/* Message */}
        <h2 className="text-lg sm:text-xl font-semibold mt-4">
          Your Documents Have Been Uploaded Successfully
        </h2>
        <p className="text-gray-500 text-sm mt-2 leading-5  text-justify">
          Congratulations! Your account has been successfully registered on{" "}
          <Link to="/" className=" text-orange-500">Mbaay.com</Link>. Our admin team is currently reviewing
          your account for verification. Once approved, you will receive a
          confirmation email, and you can start selling on our platform. Please
          be patient as this process may take some time. If you have any
          questions, feel free to contact our support team. Thank you
          for joining Mbaay!
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
