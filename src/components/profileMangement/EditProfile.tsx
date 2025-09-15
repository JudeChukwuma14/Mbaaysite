import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type FormData = {
  name: string;
  email: string;
  address: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

// Define the shape of your Redux state (based on your user slice)
interface User {
  name: string;
  email: string;
  address?: string; // Optional, as it may not always be present
}

interface RootState {
  user: {
    user: User | null;
    token: string | null;
  };
}

const EditProfile: React.FC = () => {
  // Access user data from Redux
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    console.log("Form submitted:", data);
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex-1 w-full p-6">
        <div className="p-6 bg-white">
          <h1 className="mb-4 text-2xl font-bold">Edit Your Profile</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 font-bold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "First name is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-bold text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 font-bold text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className="w-full p-2 border rounded"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block mb-2 font-bold text-gray-700"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  {...register("currentPassword")}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 font-bold text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword")}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block mb-2 font-bold text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  {...register("confirmNewPassword")}
                  className="w-full p-2 border rounded"
                />
                {watch("newPassword") &&
                  watch("confirmNewPassword") &&
                  watch("newPassword") !== watch("confirmNewPassword") && (
                    <p className="text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => reset()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
