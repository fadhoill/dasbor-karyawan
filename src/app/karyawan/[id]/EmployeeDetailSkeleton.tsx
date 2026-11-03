
export function EmployeeDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="h-4 w-48 rounded bg-gray-200" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Employee Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-5 w-40 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Payroll & Performance Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-6 shadow-sm space-y-4"
          >
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-8 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Payroll History */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-40 rounded bg-gray-200" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b pb-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 flex-1 rounded bg-gray-200"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Performance History */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b pb-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 flex-1 rounded bg-gray-200"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
