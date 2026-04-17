/** Shown while the profile RSC loads — improves perceived performance vs a blank screen. */
export default function ProfileLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-[#fafafa] pb-24">
      <div className="h-10 bg-[#E65C00]" />
      <div className="animate-pulse px-5 pt-8">
        <div className="mx-auto h-16 w-24 rounded-lg bg-zinc-200/90" />
        <div className="mx-auto mt-5 h-7 w-full max-w-[280px] rounded-md bg-zinc-200/80" />
        <div className="mx-auto mt-3 h-4 w-full max-w-[200px] rounded bg-zinc-100" />
        <div className="mx-auto mt-6 flex justify-center gap-2">
          <div className="h-9 w-24 rounded-full bg-zinc-200/70" />
          <div className="h-9 w-24 rounded-full bg-zinc-200/70" />
        </div>
        <div className="mt-10 space-y-3">
          <div className="h-4 w-32 rounded bg-zinc-200/60" />
          <div className="h-24 w-full rounded-xl bg-zinc-100" />
          <div className="h-24 w-full rounded-xl bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
