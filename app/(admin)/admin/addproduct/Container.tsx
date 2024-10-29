interface ContainerProps {
  children: React.ReactNode;
}
export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-10">{children}</div>
  );
}
