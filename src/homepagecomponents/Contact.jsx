import React, { useRef, useState } from 'react';
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Ishan Dhotre",
          from_email: form.email,
          to_email: "ishandhotre26@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

 return (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 px-4">
    {/* Get in touch heading */}
    <h2 className="text-white text-2xl font-bold mb-6">
      Get in touch
    </h2>

    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <label className="flex flex-col mb-4">
        <span className="text-white font-medium mb-2">Your Name</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="bg-gray-700 py-3 px-4 placeholder-gray-400 text-white rounded-lg outline-none border-none"
        />
      </label>
      <label className="flex flex-col mb-4">
        <span className="text-white font-medium mb-2">Your Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="bg-gray-700 py-3 px-4 placeholder-gray-400 text-white rounded-lg outline-none border-none"
        />
      </label>
      <label className="flex flex-col mb-4">
        <span className="text-white font-medium mb-2">Your Message</span>
        <textarea
          rows={5}
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message here"
          className="bg-gray-700 py-3 px-4 placeholder-gray-400 text-white rounded-lg outline-none border-none"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-600 py-3 px-4 rounded-lg text-white font-bold
        transition-transform duration-200 transform hover:bg-blue-700 hover:scale-105"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  </div>
);
};

export default Contact;
