type User = {
  name: string;
  email: string;
  job: string;
  date: string;
  last: string;
};

type UsersTableProps = {
  users: User[];
  currentUsers: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function UsersTable({
  users,
  currentUsers,
  currentPage,
  totalPages,
  totalUsers,
  onPrev,
  onNext,
}: UsersTableProps) {
  const hasUsersData = users.length > 0;

  return (
    <div className="bg-white border border-[#A5C9D7] rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#E2E8F0]">
        <h2 className="text-xl font-bold text-[#003A6C]">
          Usuarios registrados ({totalUsers})
        </h2>
      </div>

      {hasUsersData ? (
        <>
          <div className="overflow-x-auto print:hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#4B778D] text-sm uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold border-b border-[#E2E8F0]">
                    Nombre
                  </th>
                  <th className="px-6 py-3 font-semibold border-b border-[#E2E8F0]">
                    Correo
                  </th>
                  <th className="px-6 py-3 font-semibold border-b border-[#E2E8F0]">
                    Ocupación
                  </th>
                  <th className="px-6 py-3 font-semibold border-b border-[#E2E8F0]">
                    Fecha de registro
                  </th>
                  <th className="px-6 py-3 font-semibold border-b border-[#E2E8F0]">
                    Última conexión
                  </th>
                </tr>
              </thead>

              <tbody className="text-[#003A6C] divide-y divide-[#E2E8F0]">
                {currentUsers.map((user, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.job}</td>
                    <td className="px-6 py-3 text-sm">{user.date}</td>
                    <td className="px-6 py-3 text-sm">{user.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="
                print:hidden
                flex flex-col sm:flex-row
                items-center
                justify-between
                gap-3
                px-3 sm:px-6
                py-4
                border-t border-[#E2E8F0]
              "
            >
              <button
                onClick={onPrev}
                disabled={currentPage === 1}
                className="
                  w-full sm:w-auto
                  px-3 sm:px-4
                  py-2
                  rounded-lg
                  border border-[#A5C9D7]
                  text-[#003A6C]
                  text-sm
                  disabled:opacity-50
                "
              >
                ← Anterior
              </button>

              <span className="text-sm text-[#4B778D]">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="
                  w-full sm:w-auto
                  px-3 sm:px-4
                  py-2
                  rounded-lg
                  border border-[#A5C9D7]
                  text-[#003A6C]
                  text-sm
                  disabled:opacity-50
                "
              >
                Siguiente →
              </button>
            </div>
          </div>

          <div className="hidden print:block">
            <table className="w-full text-left border-collapse mt-6">
              <thead>
                <tr className="text-[#4B778D] text-sm uppercase tracking-wider">
                  <th className="px-4 py-3 border-b">Nombre</th>
                  <th className="px-4 py-3 border-b">Correo</th>
                  <th className="px-4 py-3 border-b">Ocupación</th>
                  <th className="px-4 py-3 border-b">Fecha de registro</th>
                  <th className="px-4 py-3 border-b">Última conexión</th>
                </tr>
              </thead>

              <tbody className="text-[#003A6C]">
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#E2E8F0]"
                  >
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.job}</td>
                    <td className="px-4 py-3">{user.date}</td>
                    <td className="px-4 py-3">{user.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[250px]">
          <p className="text-[#4B5563]">
            Aún no hay usuarios registrados.
          </p>
        </div>
      )}
    </div>
  );
}