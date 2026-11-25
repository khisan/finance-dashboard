import { useState } from "react"
import { DataTable } from "@/components/DataTable"
import { RowActions } from "@/components/RowActions"
import { Button } from "@/components/ui"
import { CreateModal } from "@/components/CreateModal"
import { userCreateFields, userEditFields } from "@/forms/createFields"
import { useAsync } from "@/hooks/useApi"
import { useCanWrite } from "@/hooks/useAuth"
import { toFormValues } from "@/lib/formValues"
import { createUser, getUsers, updateUser } from "@/services/userService"
import type { User } from "@/types/user"

export default function UsersPage() {
  const canWrite = useCanWrite()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: string; values: Record<string, string> } | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const { data, loading, error, refetch } = useAsync<User[]>("users", getUsers)

  const openEdit = (user: User) => {
    if (!user.id) {
      setEditError("ID user tidak tersedia dari backend.")
      return
    }
    setEditError(null)
    setEditing({ id: user.id, values: toFormValues(userEditFields, user) })
  }

  const columns = [
    { key: "name", header: "Nama" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (r) => <span className="capitalize">{(r as User).role}</span>,
    },
  ]

  return (
    <>
      {editError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {editError}
        </p>
      ) : null}
      <DataTable<User>
        columns={columns}
        rows={data ?? []}
        loading={loading}
        error={error}
        onRetry={refetch}
        searchKeys={["name", "email", "role"]}
        pageSize={8}
        emptyMessage="Belum ada pengguna. Tambahkan pengguna baru."
        title="Pengguna"
        subtitle="Kelola pengguna — klik ikon mata untuk detail atau pensil untuk edit"
        action={canWrite ? <Button onClick={() => setOpen(true)}>+ Tambah User</Button> : undefined}
        rowActions={(r) => (
          <RowActions
            detailPath={`/users/${encodeURIComponent(r.email)}`}
            onEdit={() => openEdit(r)}
          />
        )}
      />

      {canWrite && open && (
        <CreateModal
          title="Tambah Pengguna"
          subtitle="Akun baru langsung aktif di backend."
          fields={userCreateFields}
          onSubmit={createUser}
          onSuccess={() => refetch()}
          onClose={() => setOpen(false)}
        />
      )}
      {canWrite && editing && (
        <CreateModal
          title="Edit Pengguna"
          subtitle="Password dikosongkan berarti kunci lama tetap dipakai."
          fields={userEditFields}
          initialValues={editing.values}
          submitLabel="Simpan Perubahan"
          onSubmit={(payload) =>
            updateUser(
              editing.id,
              payload as unknown as Parameters<typeof updateUser>[1],
            )
          }
          onSuccess={() => {
            setEditing(null)
            refetch()
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
