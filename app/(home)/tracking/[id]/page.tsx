import Tracking from "./components/Tracking";

export default function TrackingPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Tracking id={params.id} />
    </div>
  );
}
