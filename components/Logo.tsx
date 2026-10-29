import Image from "next/image";
import logo from "@/public/images/site/logo.png";

// Логотип бренда. У файла белый фон — mix-blend-multiply растворяет его в цвете страницы.
export function Logo({ className = "", size = 44 }: { className?: string; size?: number }) {
  return (
    <Image
      src={logo}
      alt="Luma Kids"
      width={size}
      height={size}
      loading="eager"
      className={`mix-blend-multiply ${className}`}
    />
  );
}
