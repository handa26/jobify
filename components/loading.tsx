export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center p-6 space-y-2">
			<div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
			<p className="text-gray-500 text-sm animate-pulse">Loading content...</p>
		</div>
	);
}
