"use client";
import React from "react";

import Section1 from "../components/home/Section1";
import Section2 from "../components/home/Section2";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Section1 />
          <section className="mt-12">
            <Section2 />
          </section>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Shopora — Demo by You
      </footer>
    </div>
  );
}
