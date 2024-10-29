interface ContainerProps {
  children: React.ReactNode;
}
export default function MobileContainer({ children }: ContainerProps) {
  return <div className="max-w-sm mx-auto p-2">{children}</div>;
}
