<script setup>
import { ref, onMounted } from 'vue';
const { createOpenViewer } = window.Doc;
const docs = ref([]);
async function getDocs() {
  const remoteDocs = await fetch('/docs/doc.json').then(res => res.json());
  docs.value = remoteDocs.map(item => {
    return {
      id: item.id,
      title: item.title,
    }
  }).sort((a, b) => a.id - b.id);
}
onMounted(() => {
  getDocs();
});
// 创建阅读器
const viewer = createOpenViewer(document.getElementById('root'), {});
// 设置内容
async function changeDoc({ id }) {
  const doc = await fetch(`/docs/${id}.json`).then(res => res.json());
  viewer.setDocument('text/lake', doc.data.content);
}
</script>

<template>
  <div class="sider-bar"></div>
  <ul>
    <li v-for="doc in docs" :key="doc.id" @click="changeDoc(doc)">{{ doc.title }}</li>
  </ul>
</template>

<style scoped></style>
