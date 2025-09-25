"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Plus, X } from "lucide-react"
import { obtenerUsuarios, crearUsuario } from "../api/usuarioApi"
import { useUsuarioStore } from "../store/usuarioStore"
import type { Usuario } from "../types/dto/Usuario"

const PaginaInicioSesion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [creandoUsuario, setCreandoUsuario] = useState(false)

  const navigate = useNavigate()
  const setUsuario = useUsuarioStore((state) => state.setUsuario)

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true)
        const listaUsuarios = await obtenerUsuarios()
        setUsuarios(listaUsuarios)
      } catch (err) {
        setError("Error al cargar los usuarios")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    cargarUsuarios()
  }, [])

  const handleSelectUsuario = (usuario: Usuario) => {
    setUsuario(usuario)
    navigate("/")
  }

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreUsuario.trim()) return

    try {
      setCreandoUsuario(true)
      const nuevoUsuario = await crearUsuario(nombreUsuario.trim())
      setUsuarios([...usuarios, nuevoUsuario])
      setMostrarModal(false)
      setNombreUsuario("")
    } catch (err) {
      console.error("Error al crear usuario:", err)
      alert("Error al crear el usuario")
    } finally {
      setCreandoUsuario(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenido/a</h1>
          <p className="text-lg text-gray-600">Por favor, selecciona tu perfil para continuar</p>
        </div>

        {/* User Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <button
              key={usuario.idUsuario}
              onClick={() => handleSelectUsuario(usuario)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-600" />
                </div>
                <span className="text-lg font-medium text-gray-800 text-center">{usuario.nombre}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors duration-200"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Crear Nuevo Usuario</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Sistema de Gestión © 2024</p>
        </div>

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Crear Nuevo Usuario</h2>
                <button
                  onClick={() => {
                    setMostrarModal(false)
                    setNombreUsuario("")
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCrearUsuario} className="p-6">
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa el nombre del usuario"
                    required
                    disabled={creandoUsuario}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarModal(false)
                      setNombreUsuario("")
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={creandoUsuario}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50"
                    disabled={creandoUsuario || !nombreUsuario.trim()}
                  >
                    {creandoUsuario ? "Creando..." : "Crear Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginaInicioSesion
