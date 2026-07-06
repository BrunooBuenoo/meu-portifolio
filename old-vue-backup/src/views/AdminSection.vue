<template>
  <div class="container section">
    <router-link to="/admin" class="underline">← Voltar</router-link>
    <h2 style="margin-top:8px">{{ section?.title || 'Seção' }}</h2>

    <div v-if="typeHasItems" class="section">
      <div class="row" style="justify-content:space-between; align-items:center">
        <h3>Itens</h3>
        <button @click="createItem">+ Novo item</button>
      </div>
      <div class="grid">
        <div v-for="i in items" :key="i.id" class="card">
          <div class="form" style="display:grid; gap:8px">
            <input v-model="i.title" placeholder="Título" />
            <textarea rows="3" v-model="i.description" placeholder="Descrição"></textarea>
            <input v-model="i.imageUrl" placeholder="Imagem URL (opcional)" />
            <input v-model="i.link" placeholder="Link (opcional)" />
            <input type="text" v-model="tagsStr[i.id]" placeholder="Tags separadas por vírgula" />
            <input type="number" class="w-24" v-model.number="i.order" placeholder="Ordem" />
          </div>
          <div class="controls" style="margin-top:8px">
            <button @click="saveItem(i)">Salvar</button>
            <button @click="deleteItem(i.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Dados da seção</h3>
      <div class="form" style="display:grid; gap:8px; max-width:640px">
        <input v-model="section.title" placeholder="Título" />
        <input v-model="section.type" placeholder="Tipo" />
        <input type="number" v-model.number="section.order" placeholder="Ordem" />
        <label><input type="checkbox" v-model="section.isVisible" /> Visível</label>
        <textarea rows="4" v-model="rawData" placeholder='JSON do campo "data" da seção'></textarea>
        <button @click="saveSection">Salvar seção</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase.js'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore'

const route = useRoute()
const sid = route.params.id

const section = reactive({})
const items = ref([])
const tagsStr = reactive({})
const rawData = ref('{}')

const typeHasItems = true

const loadSection = async () => {
  const snap = await getDoc(doc(db, 'sections', sid))
  Object.assign(section, { id: snap.id, ...snap.data() })
  rawData.value = JSON.stringify(section.data || {}, null, 2)
}

const loadItems = async () => {
  const q = query(collection(doc(db,'sections', sid), 'items'), orderBy('order','asc'))
  const snap = await getDocs(q)
  items.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  items.value.forEach(it => { tagsStr[it.id] = (it.tags || []).join(', ') })
}

const saveSection = async () => {
  let data = {}
  try { data = JSON.parse(rawData.value || '{}') } catch(e){ alert('JSON inválido no campo data'); return }
  await updateDoc(doc(db, 'sections', sid), {
    title: section.title,
    type: section.type,
    order: section.order,
    isVisible: !!section.isVisible,
    data
  })
  alert('Seção salva.')
}

const createItem = async () => {
  await addDoc(collection(doc(db,'sections', sid), 'items'), {
    title: 'Novo item', description: '', imageUrl: '', link: '', tags: [], order: (items.value.at(-1)?.order ?? 0) + 10
  })
  await loadItems()
}

const saveItem = async (i) => {
  const ref = doc(doc(db,'sections', sid), 'items', i.id)
  const tags = (tagsStr[i.id] || '').split(',').map(t => t.trim()).filter(Boolean)
  await updateDoc(ref, { title: i.title, description: i.description, imageUrl: i.imageUrl, link: i.link, order: i.order, tags })
  alert('Item salvo.')
}

const deleteItem = async (id) => {
  if (!confirm('Excluir item?')) return
  await deleteDoc(doc(doc(db,'sections', sid), 'items', id))
  await loadItems()
}

onMounted(async () => {
  await loadSection()
  await loadItems()
})
</script>