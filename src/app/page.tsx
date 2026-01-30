export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          Trading App
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center">
          Multi-market automated trading platform
        </p>
      </main>
    </div>
  );
}
