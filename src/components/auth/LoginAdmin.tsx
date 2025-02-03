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
  email: string;
  password: string;
  terms: boolean;
};

const LoginAdmin = () => {
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
              <span className="text-gray-600">Don't have an account? </span>
              <a href="#" className="text-blue-500 hover:underline">
                Sign in
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-6">
              <h2 className="text-2xl font-semibold text-left mb-4">Login</h2>
              <a href="/" className="text-left text-sm">Forgot Passwor?</a>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="mt-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.email?.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: 8,
                    })}
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.password?.message}
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("terms", { required: true })}
                    className="mr-2"
                  />
                  <label className="text-sm">Keep me logged in</label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm">
                    You must accept the terms
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-500 text-white rounded-md"
                >
                  Login
                </button>
              </form>
              
              <button className="w-full py-2 mt-4 border rounded-md flex items-center justify-center">
                <span className="text-xl">
                  <FcGoogle />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
