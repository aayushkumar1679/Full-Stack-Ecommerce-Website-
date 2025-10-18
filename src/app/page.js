"use client";
import React from "react";
import Section1 from "../components/home/Section1";
import Section2 from "../components/home/Section2";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* <img
        src="/bg.png"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      /> */}

      <Section1 />
      <Section2 />
    </main>
  );
}
