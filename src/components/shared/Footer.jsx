import React from "react";
import { HashLink } from "react-router-hash-link";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <HashLink smooth to="/" className="link link-hover">
                Home
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="/#products" className="link link-hover">
                Products
              </HashLink>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <HashLink smooth to="/#contact" className="link link-hover">
                Contact Us
              </HashLink>
            </li>
            <li className="text-sm text-gray-500 dark:text-gray-400 cursor-default">
              FAQ
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li className="text-sm text-gray-500 dark:text-gray-400 cursor-default">
              Terms of Service
            </li>
            <li className="text-sm text-gray-500 dark:text-gray-400 cursor-default">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex justify-center sm:justify-start space-x-4 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} MultiVendorShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
