"use client";

import { useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  image: { asset: object; alt?: string };
  title: string;
  width: number;
  height: number;
};

export default function ArtworkImage({ image, title, width, height }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

  return (
    <>
      <button
        onClick={open}
        className="relative block w-full bg-stone-100 cursor-zoom-in group"
        aria-label="View full size"
      >
        <Image
          src={urlFor(image).width(900).url()}
          alt={image.alt ?? title}
          width={width}
          height={height}
          className="w-full h-auto"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-stone-900/70 text-stone-100 text-[10px] uppercase tracking-widest px-2 py-1">
            Expand
          </span>
        </div>
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          maxWidth: "none",
          maxHeight: "none",
          margin: 0,
          padding: "2rem",
          border: "none",
          background: "rgba(28, 25, 23, 0.96)",
        }}
      >
        <button
          onClick={close}
          className="absolute top-5 right-6 text-stone-400 hover:text-stone-100 text-xs uppercase tracking-widest transition-colors"
          aria-label="Close"
        >
          ✕ Close
        </button>
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={urlFor(image).width(2400).url()}
            alt={image.alt ?? title}
            width={width}
            height={height}
            style={{
              maxWidth: "100%",
              maxHeight: "calc(100dvh - 4rem)",
              width: "auto",
              height: "auto",
            }}
            className="object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
