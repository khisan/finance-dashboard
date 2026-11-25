import { Eye, Pencil } from "lucide-react"
import { useCanWrite } from "@/hooks/useAuth"

/** Compact detail/edit buttons used as the last column of resource tables. */
export function RowActions({
  detailPath,
  onEdit,
  editDisabled,
  editTitle,
}: {
  detailPath: string
  onEdit: () => void
  editDisabled?: boolean
  editTitle?: string
}) {
  const canWrite = useCanWrite()

  return (
    <>
      <a
        href={detailPath}
        aria-label="Lihat detail"
        title="Lihat detail"
        data-action="detail"
        className="rounded-lg border-0 p-1.5 text-white bg-green-500 hover:bg-green-400"
      >
        <Eye className="h-4.5 w-4.5" />
      </a>
      {canWrite ? (
        <button
          type="button"
          onClick={onEdit}
          disabled={editDisabled}
          aria-label="Edit"
          title={editTitle ?? "Edit"}
          data-action="edit"
          className="rounded-lg border-0 p-1.5 text-white bg-amber-600 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <Pencil className="h-4.5 w-4.5" />
        </button>
      ) : null}
    </>
  )
}
