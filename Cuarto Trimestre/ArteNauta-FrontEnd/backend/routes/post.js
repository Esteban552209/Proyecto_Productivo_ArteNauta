import { Router } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('publicaciones') 
    .select(`*,usuarios (id_usuario, nombre)`)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router