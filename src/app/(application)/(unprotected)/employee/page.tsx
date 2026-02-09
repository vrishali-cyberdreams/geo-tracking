import MarkLocation from "@/components/employee/markLocation";

export default async function page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <MarkLocation />
      </div>
    </div>
  )
}
