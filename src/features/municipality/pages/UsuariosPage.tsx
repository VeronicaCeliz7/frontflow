import { useState, useEffect } from 'react'
import { UserPlus, Users, Mail, Building2, Shield, X } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'

interface FormData {
  nombre: string
  apellido: string
  email: string
  role: 'operador'
  municipio: string
}

interface Usuario {
  id: string
  nombre: string
  email: string
  role: string
  municipio: string
}

const MUNICIPIOS = [
  { value: 'villa-maria', label: 'Villa María' },
  { value: 'villa-nueva', label: 'Villa Nueva' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'rio-cuarto', label: 'Río Cuarto' },
  { value: 'bell-ville', label: 'Bell Ville' },
  { value: 'alta-gracia', label: 'Alta Gracia' },
  { value: 'jesus-maria', label: 'Jesús María' },
  { value: 'marcos-juarez', label: 'Marcos Juárez' },
  { value: 'otro', label: 'Otro municipio de Argentina' }
]

export default function UsuariosPage() {
  const { getToken } = useAuth()

  const [form, setForm] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    role: 'operador',
    municipio: 'villa-maria'
  })

  const [municipioOtro, setMunicipioOtro] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [showModal, setShowModal] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const cargarUsuarios = async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        `${API_URL}/api/users/municipio/lista?municipio=villa-maria`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await response.json()
      console.log('📦 USUARIOS MUNICIPIO:', data)
      
      if (!response.ok) throw new Error(data.error || 'Error al cargar usuarios')

      setUsuarios(data.usuarios || [])
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cerrarModal = () => {
    setShowModal(false)
    setMensaje(null)
    setMunicipioOtro('')
  }

  const handleSubmit = async () => {
    const municipioFinal = form.municipio === 'otro' ? municipioOtro.trim() : form.municipio

    if (!form.nombre || !form.email || !municipioFinal) {
      setMensaje({
        tipo: 'error',
        texto: 'Nombre, email y municipio son obligatorios'
      })
      return
    }

    setLoading(true)
    setMensaje(null)

    try {
      const token = await getToken()

      const payload = {
        ...form,
        municipio: municipioFinal,
        role: 'operador'
      }

      const response = await fetch(`${API_URL}/api/users/municipio/invitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      
      if (!response.ok) throw new Error(data.error || 'Error al crear usuario')

      await cargarUsuarios()

      setForm({
        nombre: '',
        apellido: '',
        email: '',
        role: 'operador',
        municipio: 'villa-maria'
      })
      setMunicipioOtro('')

      setMensaje({
        tipo: 'ok',
        texto: data.passwordTemporal
          ? `Usuario ${data.usuario.nombre} creado exitosamente. Contraseña temporal: ${data.passwordTemporal}`
          : `Usuario ${data.usuario.nombre} creado exitosamente`
      })
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error inesperado'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Gestión de operadores
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Administrá los operadores municipales habilitados para gestionar incidentes.
          </p>
        </div>

        <button
          onClick={() => {
            setMensaje(null)
            setShowModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          Invitar operador
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-blue-600 p-2 rounded-md">
            <Users size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">
            Operadores del municipio
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Nombre</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Rol</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Municipio</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                    {u.nombre}
                  </td>
                  <td className="py-3 px-2 text-gray-500">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Operador
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">{u.municipio}</td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Todavía no hay operadores cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-md">
                  <UserPlus size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Invitar operador municipal
                  </h2>
                  <p className="text-xs text-gray-500">
                    El operador podrá tomar y gestionar incidentes asignados a su municipio.
                  </p>
                </div>
              </div>

              <button
                onClick={cerrarModal}
                className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Apellido</label>
                  <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Correo electrónico *
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md bg-white focus-within:border-blue-400">
                    <div className="px-3 text-gray-400 flex items-center">
                       <Mail size={15} />
                   </div>

                   <input
                      name="email"
                      type="email"
                     value={form.email}
                     onChange={handleChange}
                     placeholder="operador@municipio.gob.ar"
                     className="w-full py-2.5 pr-4 text-sm focus:outline-none bg-transparent"
                    />
                   </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Rol</label>
                  <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                    <div className="px-3 text-gray-400 flex items-center">
                      <Shield size={15} />
                   </div>

                   <input
                     value="Operador municipal"
                     disabled
                     className="w-full py-2.5 pr-4 text-sm bg-transparent text-gray-500 focus:outline-none"
                     />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Municipio *
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-md bg-white focus-within:border-blue-400">
                    <div className="px-3 text-gray-400 flex items-center">
                      <Building2 size={15} />
                    </div>

                    <select
                      name="municipio"
                      value={form.municipio}
                      onChange={handleChange}
                      className="w-full py-2.5 pr-4 text-sm focus:outline-none bg-transparent"
                   >
                     {MUNICIPIOS.map((m) => (
                       <option key={m.value} value={m.value}>
                         {m.label}
                       </option>
                      ))}
                    </select>
                  </div>
                </div>

                {form.municipio === 'otro' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Ingresar municipio
                    </label>
                    <input
                      value={municipioOtro}
                      onChange={(e) => setMunicipioOtro(e.target.value)}
                      placeholder="Ej: bell-ville"
                      className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                )}
              </div>

              {mensaje && (
                <div
                  className={`mt-4 px-4 py-3 rounded-md text-sm font-medium ${
                    mensaje.tipo === 'ok'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {mensaje.texto}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  {loading ? 'Creando operador...' : 'Invitar operador'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}