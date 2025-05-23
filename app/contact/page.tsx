"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ContactPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormData((prev) => ({ ...prev, subject }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data in the format expected by the enquiries API
      const enquiryData = {
        title: formData.subject,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        description: formData.message,
      };

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryData),
      });

      if (!response.ok) throw new Error("Failed to submit enquiry");

      toast.success("Message sent successfully!", {
        description: "We will get back to you soon.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });

      // Optional: redirect to home page after successful submission
      // router.push("/");
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Error sending message", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
          Contact Us
        </h1>
        <p className="text-lg text-black/80 dark:text-gray-300 ">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row p-2 bg-black dark:bg-white">
            {/* Left Panel - Contact Information */}
            <div className="w-full lg:w-2/5 bg-white dark:bg-black text-black dark:text-white p-6 md:p-10 relative overflow-hidden rounded-lg">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                  Contact Information
                </h2>
                <p className="text-black/80 dark:text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
                  Say something to start a live chat!
                </p>

                <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base break-all">
                      {siteConfig.contact.email}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </a>
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </a>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Decorative Circles - Overlapping design */}
              <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48">
                {/* Small dark gray circle */}
                <div className="absolute bottom-20 right-24 h-16 w-16 md:h-40 md:w-40 z-10 bg-[#48484880] rounded-full" />
                {/* Large black circle */}
                <div className="absolute -bottom-16 -right-16 h-12 w-12 md:h-64 md:w-64 bg-[#1A1A1A] rounded-full" />
              </div>
            </div>

            {/* Right Panel - Contact Form */}
            <div className="w-full lg:w-3/5 p-6 md:p-10 bg-black dark:bg-white text-white dark:text-black">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white dark:text-black">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border-0 border-b border-white dark:border-black bg-transparent px-0 py-2 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 focus:border-white dark:focus:border-black focus:outline-none focus:ring-0 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white dark:text-black">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border-0 border-b border-white dark:border-black bg-transparent px-0 py-2 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 focus:border-white dark:focus:border-black focus:outline-none focus:ring-0 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white dark:text-black">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="example@gmail.com"
                      className="w-full border-0 border-b border-white dark:border-black bg-transparent px-0 py-2 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 focus:border-white dark:focus:border-black focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white dark:text-black">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="^[+]?[0-9]{9,12}$"
                      className="w-full border-0 border-b border-white dark:border-black bg-transparent px-0 py-2 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 focus:border-white dark:focus:border-black focus:outline-none focus:ring-0 transition-colors"
                      placeholder="+1 012 3456 789"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white dark:text-black">
                    Select Subject?
                  </label>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {[
                      "General Inquiry",
                      "Legal Consultation",
                      "Case Review",
                      "Document Review",
                    ].map((subject, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={subject}
                          checked={formData.subject === subject}
                          onChange={() => handleSubjectChange(subject)}
                          className="w-4 h-4 text-white dark:text-black border-white dark:border-black focus:ring-white dark:focus:ring-black focus:ring-2 bg-transparent"
                        />
                        <span className="text-sm text-white dark:text-black">
                          {subject}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white dark:text-black">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full border-0 border-b border-white dark:border-black bg-transparent px-0 py-2 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 focus:border-white dark:focus:border-black focus:outline-none focus:ring-0 resize-none transition-colors"
                    placeholder="Write your message..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-md font-medium transition-colors"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
