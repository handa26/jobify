import Navbar from "@/components/navbar";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}