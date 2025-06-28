import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiMessageCircle } from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for contacting us!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-base-200 dark:bg-base-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-base-100 dark:bg-base-200 rounded-lg shadow-lg p-6 sm:p-8 border border-base-300 dark:border-base-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-base-content">
          Contact Us
        </h2>
        <p className="text-center text-sm text-base-content/70 mb-6">
          We'd love to hear from you! Fill out the form below and we'll get back
          to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1 text-base-content">
              Name
            </label>
            <div className="flex items-center border border-base-300 dark:border-base-100 rounded px-3 py-2 bg-base-100 dark:bg-base-200">
              <FiUser className="text-base-content/50 mr-2" />
              <input
                type="text"
                name="name"
                className="w-full bg-transparent outline-none text-base-content placeholder-base-content/50"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1 text-base-content">
              Email
            </label>
            <div className="flex items-center border border-base-300 dark:border-base-100 rounded px-3 py-2 bg-base-100 dark:bg-base-200">
              <FiMail className="text-base-content/50 mr-2" />
              <input
                type="email"
                name="email"
                className="w-full bg-transparent outline-none text-base-content placeholder-base-content/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-1 text-base-content">
              Message
            </label>
            <div className="flex items-start border border-base-300 dark:border-base-100 rounded px-3 py-2 bg-base-100 dark:bg-base-200">
              <FiMessageCircle className="text-base-content/50 mt-1 mr-2" />
              <textarea
                name="message"
                rows="5"
                className="w-full bg-transparent outline-none text-base-content placeholder-base-content/50"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-8 py-2 text-white rounded-md shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
