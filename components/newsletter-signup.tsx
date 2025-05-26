"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isAgreed) {
      toast.error("Please fill in all fields and agree to the terms");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to subscribe the user
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
      setIsAgreed(false);
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-12"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 px-8 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Sign Up for Our Newsletters
          </h2>
          <p className="text-xl text-white/90">
            Get notified of the best deals on our WordPress themes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input and Subscribe button in one row */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white text-gray-900 placeholder:text-gray-500 border-0 rounded-lg text-lg px-4"
                required
              />
              <Button
                type="submit"
                disabled={isLoading || !email || !isAgreed}
                className="h-12 px-8 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg whitespace-nowrap"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>

            {/* Checkbox and terms */}
            <div className="flex items-start justify-center space-x-3 text-sm max-w-3xl mx-auto">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 border border-white/30 rounded bg-white/20 text-white focus:ring-white"
              />
              <label
                htmlFor="agree"
                className="text-white/90 text-left leading-relaxed"
              >
                By checking this box, you confirm that you have read and are
                agreeing to our terms of use regarding the storage of the data
                submitted through this form.
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
