interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div className={`max-w-screen-xl mx-auto px-2 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}
