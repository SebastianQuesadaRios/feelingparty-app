import { ref } from 'vue'
import type { Cotizacion, Item, Cliente } from '~/types/cotizacion'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default function useCotizaciones() {
  const cotizacionActual = ref<Cotizacion>({
    cliente: {
      nombre: '',
      empresa: '',
      direccion: ''
    },
    items: [],
    subtotal: 0,
    total: 0
  })

  const guardarCotizacion = async (cotizacion: Cotizacion) => {
    try {
      // Asegurarnos de que subtotal y total estén actualizados
      cotizacion.subtotal = cotizacion.total
      
      const response = await $fetch<Cotizacion>('/api/cotizaciones', {
        method: 'POST',
        body: cotizacion
      })
      return response
    } catch (error) {
      console.error('Error al guardar la cotización:', error)
      throw error
    }
  }

  const generarPDF = async (cotizacion: Cotizacion) => {
    try {
      const element = document.querySelector('.cotizacion-preview')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Cotizacion-${cotizacion.numero}.pdf`)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      throw error
    }
  }

  const previsualizarCotizacion = (cotizacion: Cotizacion) => {
    // Implementaremos esto después
  }

  const eliminarCotizacion = async (id: string) => {
    try {
      await $fetch(`/api/cotizaciones/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error al eliminar la cotización:', error)
      throw error
    }
  }
  
  return {
    cotizacionActual,
    guardarCotizacion,
    generarPDF,
    previsualizarCotizacion,
    eliminarCotizacion  
  }
} 