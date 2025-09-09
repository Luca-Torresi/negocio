"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import { obtenerUsuarios } from "../api/usuarioApi"
import { useUsuarioStore } from "../store/usuarioStore"
import type { Usuario } from "../types/dto/Usuario"

const PaginaInicioSesion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
              key={usuario.id}
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

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Sistema de Gestión © 2024</p>
        </div>
      </div>
    </div>
  )
}

export default PaginaInicioSesion
