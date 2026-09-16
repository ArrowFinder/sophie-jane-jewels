import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

/** Brand line icons from the official illustration pack. */
export function BrandIcon({
  name,
  tone = "black",
  size = 40,
  className,
}: {
  name: string;
  tone?: "black" | "garnet";
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={`/icons/${tone}/${name}.png`}
      alt=""
      width={size * 2}
      height={size * 2}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
