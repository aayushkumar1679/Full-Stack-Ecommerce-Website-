"use client";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const links = [
    { title: "Shop", href: "#" },
    { title: "Collections", href: "#" },
    { title: "About", href: "#" },
    { title: "Blog", href: "#" },
    { title: "Contact", href: "#" },
  ];

  const policies = [
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
    { title: "Returns", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold tracking-widest  text-gray-900 mb-3">
            ÉLEGANCE
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-xs">
            Redefining modern luxury with timeless designs and exquisite
            craftsmanship. Discover your style with ÉLEGANCE.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <Instagram className="w-4.5 h-4.5 text-gray-700" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <Facebook className="w-4.5 h-4.5 text-gray-700" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <Twitter className="w-4.5 h-4.5 text-gray-700" />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide mb-4">
            SHOP
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide mb-4">
            SUPPORT
          </h3>
          <ul className="space-y-2">
            {policies.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide mb-4">
            CONTACT
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              support@elegance.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              +1 (800) 123-4567
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 tracking-wide">
          © {new Date().getFullYear()} ÉLEGANCE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
