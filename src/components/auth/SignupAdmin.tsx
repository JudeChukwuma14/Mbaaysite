import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Sliding from "../Reuseable/Sliding";
import background from "@/assets/image/bg2.jpeg";
import logo from "@/assets/image/mbbaylogo.png";
import { ToastContainer } from "react-toastify";
const bg = {
  backgroundImage: `url(${background})`,
};
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
};

const SignupAdmin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="w-full h-screen">
    {/* ToastContainer for displaying notifications */}
    <ToastContainer />

    <div className="flex flex-col md:flex-row">
      <Sliding />
      <div
        style={bg}
        className="bg-center bg-no-repeat bg-cover w-full min-h-screen px-4 lg:ml-[500px]"
      >
        {/* Logo for small screens */}
        <div className="flex justify-between items-center px-4 my-6">
          <div className="lg:hidden">
            <img src={logo} width={50} alt="" />
          </div>
          {/* Sign Up Link */}
          <div className="w-full hidden text-end lg:block">
            <span className="text-gray-600">Already have an account? </span>
            <a href="#" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-left mb-4">Register</h2>
        <p>Sign up with</p>

        <button className="w-full py-2 mb-4 border rounded-md flex items-center justify-center">
          <span className="text-xl"><FcGoogle /></span>
        </button>

        <div className="text-left text-black font-bold mb-4">OR</div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-left text-black font-bold mb-4">Your Name</h1>
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
          </div>
          <h1 className="text-left text-black font-bold mb-4">Login Details</h1>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: 8 })}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="flex items-center">
            <input type="checkbox" {...register("terms", { required: true })} className="mr-2" />
            <label className="text-sm">
              I agree to the <a href="#" className="text-blue-500">Terms & Conditions</a>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">You must accept the terms</p>}

          <div className="flex items-center">
            <input type="checkbox" {...register("terms", { required: true })} className="mr-2" />
            <label className="text-sm">
              Keep me logged in
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">You must accept the terms</p>}

          <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
      </div>
    </div>
  </div>
  );
};

export default SignupAdmin;
