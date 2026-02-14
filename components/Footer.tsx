export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 mt-12">
      <div className="container max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row px-4">
        <p className="text-center text-sm leading-loose text-slate-500 md:text-left">
          &copy; {new Date().getFullYear()} Personal Job Portal. Built with Next.js & MongoDB.
        </p>
        <div className="flex gap-4 text-sm text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
          <span className="hover:text-blue-600 cursor-pointer">Terms</span>
        </div>
      </div>
    </footer>
  );
}