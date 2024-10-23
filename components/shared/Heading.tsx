interface HeadingProps {
  title: string;
  center?: boolean;
}
export default function Heading({ title, center }: HeadingProps) {
  return (
    <div className={center ? "text-center" : "tex text-start"}>
      <h1 className="font-medium text-xl">{title}</h1>
    </div>
  );
}
