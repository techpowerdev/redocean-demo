interface ContainerProps {
  children: React.ReactNode;
}
export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-2 sm:px-10">{children}</div>
  );
}
