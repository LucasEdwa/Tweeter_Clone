export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="p-4 border-b-2 border-gray-700">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
