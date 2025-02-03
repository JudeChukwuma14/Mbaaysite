import React, { useState } from "react";

const CancellationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    orderId: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    postalCode: "",
    action: "cancel", // cancel or postpone
    fromDate: "",
    toDate: "",
    reason: "",
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    console.log(formData); // Replace with your submission logic
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Cancellation / Postponement Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="orderId">
              Order Number/ID
            </label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="Order ID"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(000) 000-0000"
            className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="streetAddress">
            Address
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Street Address"
            className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
          />
          <input
            type="text"
            name="streetAddress2"
            value={formData.streetAddress2}
            onChange={handleChange}
            placeholder="Street Address 2"
            className="w-full p-3 mt-4 border rounded-md focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            />
          </div>
          <div>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State/Province"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            />
          </div>
          <div>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal/Zip Code"
              className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium mb-4">
            Do you want to cancel or postpone your order?
          </legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="action"
                value="cancel"
                checked={formData.action === "cancel"}
                onChange={handleChange}
                className="mr-2"
              />
              I want to cancel my order.
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="action"
                value="postpone"
                checked={formData.action === "postpone"}
                onChange={handleChange}
                className="mr-2"
              />
              I want to postpone my order.
            </label>
          </div>
        </fieldset>

        {formData.action === "postpone" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="fromDate">
                From
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="toDate">
                To
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="reason">
            Reason for Cancellation / Postponement
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Please specify your reason..."
            className="w-full p-3 border rounded-md focus:ring focus:ring-orange-200"
            rows={4}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <label className="text-sm">
            I agree to <a href="#" className="text-orange-500 underline">terms & conditions</a>.
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CancellationForm;
