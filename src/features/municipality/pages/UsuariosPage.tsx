import { useState, useEffect } from 'react'
import { UserPlus, Users, Mail, Building2, Shield } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'

interface FormData {
  nombre: string
  apellido: string
  email: string
  role: 'operador' | 'admin'
  municipio: string
}

interface Usuario {
  id: string
  nombre: string
  email: string
  role: string
  municipio: string
}

export default function UsuariosPage() {
  const { getToken } = useAuth()

  const [form, setForm] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    role: 'operador',
    municipio: 'villa-maria'
  })

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const cargarUsuarios = async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        `${API_URL}/api/users/municipio/lista?municipio=${encodeURIComponent(form.municipio)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar usuarios')
      }

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

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.municipio) {
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

      const response = await fetch(`${API_URL}/api/users/municipio/invitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear usuario')
      }

      await cargarUsuarios()

      setForm({
        nombre: '',
        apellido: '',
        email: '',
        role: 'operador',
        municipio: 'villa-maria'
      })

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

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de usuarios</h1>
        <p className="text-gray-400 text-sm mt-1">
          Invitá operadores y administradores a tu municipio
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-blue-600 p-2 rounded-lg">
            <UserPlus size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-gray-700">Invitar nuevo usuario</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Pérez"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="operador@municipio.gob.ar"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Rol *</label>
            <div className="relative">
              <Shield size={15} className="absolute left-3 top-3 text-gray-400" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="operador">Operador (Empleado municipal)</option>
                <option value="admin">Admin (Jefe de área)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Municipio *</label>
            <div className="relative">
              <Building2 size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="municipio"
                value={form.municipio}
                onChange={handleChange}
                placeholder="villa-maria"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {mensaje && (
          <div
            className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              mensaje.tipo === 'ok'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus size={16} />
          {loading ? 'Creando usuario...' : 'Invitar usuario'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-gray-700">Usuarios del municipio</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Nombre</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Rol</th>
                <th className="text-left py-3 px-2 text-gray-400 font-medium">Municipio</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-700">{u.nombre}</td>
                  <td className="py-3 px-2 text-gray-500">{u.email}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrador' : 'Operador'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">{u.municipio}</td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Todavía no hay usuarios cargados para este municipio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}