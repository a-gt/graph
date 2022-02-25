import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Button from "../components/Button";
import Canvas from "../components/Canvas";

export default function Home() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <Head>
        <title>Graphing Calculator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-5">
        <h1 className="text-4xl bold">Graphing Calculator</h1>
        <div className="h-[1px] w-100 bg-silver"></div>
        <div className="flex flex-row h-[500px]">
          <div className="w-full">
            {tab == 0 && <Canvas />}
            {tab == 2 && <p className="pr-8"><br />This is a graphing calculator built in JavaScript using React and the canvas. This graphing calculator can graph any polynomial, logarithmic, trigonometric, or exponential function. It uses the library expr-eval for mathematical evaluation and the library tween.js for animations.</p>}
          </div>
          <div className="bg-striped h-100 w-12 flex flex-col">
            <div
              className={
                (tab == 0 ? "bg-dark" : "") +
                " w-10 h-10 mt-2 flex items-center justify-center rounded-r-md cursor-pointer transition"
              }
              onClick={() => setTab(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className=""
              >
                <line x1={18} y1={20} x2={18} y2={10} />
                <line x1={12} y1={20} x2={12} y2={4} />
                <line x1={6} y1={20} x2={6} y2={14} />
              </svg>
            </div>
            <div
              className={
                (tab == 1 ? "bg-dark" : "") +
                " w-10 h-10 mt-2 flex items-center justify-center rounded-r-md cursor-pointer transition"
              }
              onClick={() => setTab(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className=""
              >
                <rect x={3} y={3} width={7} height={7} />
                <rect x={14} y={3} width={7} height={7} />
                <rect x={14} y={14} width={7} height={7} />
                <rect x={3} y={14} width={7} height={7} />
              </svg>
            </div>
            <div
              className={
                (tab == 2 ? "bg-dark" : "") +
                " w-10 h-10 mt-2 flex items-center justify-center rounded-r-md cursor-pointer transition"
              }
              onClick={() => setTab(2)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className=""
              >
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1={9} y1={20} x2={15} y2={20} />
                <line x1={12} y1={4} x2={12} y2={20} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
