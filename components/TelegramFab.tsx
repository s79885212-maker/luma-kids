import { telegramLink } from "@/config/site";
import { TelegramIcon } from "./icons";

// Плавающая кнопка Telegram — только на мобильных
export function TelegramFab({ label }: { label: string }) {
  return (
    <a
      href={telegramLink}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="fixed bottom-5 right-4 z-30 grid size-14 place-items-center rounded-full bg-telegram text-white shadow-[0_10px_30px_-8px_rgba(34,158,217,0.8)] transition active:scale-95 md:hidden"
    >
      <TelegramIcon className="size-7 -translate-x-px" />
    </a>
  );
}
