"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Download } from "lucide-react"

export default function Upload_File() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    const files = event.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
      setError("")
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("/api/convertir", {
  method: "POST",
  body: formData,
});
  console.log(response)

      if (!response.ok) throw new Error("Error al convertir el archivo")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = selectedFile.name.replace(".xml", ".csv")
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setError("Hubo un problema al convertir el archivo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Transformar XML a CSV</CardTitle>
          <CardDescription>Sube tu archivo XML y conviértelo a formato CSV de manera sencilla</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Seleccionar archivo XML</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <Label htmlFor="file-upload" className="text-blue-600 cursor-pointer text-primary hover:underline">
                    Haz clic aqui para seleccionar
                  </Label>
                  {" o arrastra tu archivo aquí"}
                </div>
                <p className="text-xs text-gray-500">Archivos XML únicamente</p>
              </div>
              <Input id="file-upload" type="file" accept=".xml" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">{selectedFile.name}</span>
            </div>
          )}

          <Button onClick={handleConvert} disabled={!selectedFile || loading} className="w-full bg-blue-600">
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Convirtiendo..." : "Convertir a CSV"}
          </Button>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">El archivo CSV se descargará automáticamente una vez procesado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
