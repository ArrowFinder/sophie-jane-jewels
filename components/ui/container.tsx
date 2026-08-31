import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  size?: "default" | "wide" | "narrow" | "prose";
  className?: string;
  children: React.ReactNode;
};

const sizes = {
  narrow: "max-w-3xl",
  prose: "max-w-2xl",
  default: "max-w-[88rem]",
  wide: "max-w-[100rem]",
};

export function Container<T extends React.ElementType = "div">({
  as,
  size = "default",
  className,
  children,
  ...rest
}: ContainerProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Comp = as ?? "div";
  return (
    <Comp className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", sizes[size], className)} {...rest}>
      {children}
    </Comp>
  );
}
