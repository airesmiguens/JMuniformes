import Image from "next/image";
import logo from "../../public/logo-jm.png";

// Official logo (from the company's WhatsApp file), background removed.
export function Logo({ className = "" }: { className?: string }) {
  return <Image src={logo} alt="JM Uniformes" priority className={`h-12 w-auto ${className}`} />;
}
