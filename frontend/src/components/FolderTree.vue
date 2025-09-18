<script setup lang="ts">
import { ref, watch } from "vue";

interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}
interface File {
  id: number;
  name: string;
  type: string;
  folderId: number;
}

const props = defineProps<{
  folder: Folder;
  fetchSubfolders: (id: number) => Promise<Folder[]>;
  fetchFiles: (id: number) => Promise<File[]>;
  onSelect: (id: number, name: string) => void;
  selectedId?: number | null;
}>();

const expanded = ref(false);
const children = ref<Folder[]>([]);
const files = ref<File[]>([]);
const loading = ref(false);

async function fetchChildrenAndFiles() {
  if (loading.value) return;
  loading.value = true;
  try {
    children.value = await props.fetchSubfolders(props.folder.id);
    files.value = await props.fetchFiles(props.folder.id);
  } finally {
    loading.value = false;
  }
}

async function handleClick(e?: MouseEvent) {
  e?.stopPropagation();
  if (!expanded.value) {
    await fetchChildrenAndFiles();
  }
  expanded.value = !expanded.value;
  props.onSelect(props.folder.id, props.folder.name);
}

// auto expand kalau selectedId berubah
watch(
  () => props.selectedId,
  async (newVal) => {
    if (newVal === props.folder.id) {
      expanded.value = true;
      if (children.value.length === 0) {
        children.value = await props.fetchSubfolders(props.folder.id);
      }
      if (files.value.length === 0) {
        files.value = await props.fetchFiles(props.folder.id);
      }
    }
  }
);
</script>

<template>
  <li>
    <div
      class="d-flex align-items-center folder-item px-2 py-1"
      :class="{ 'active-folder': props.selectedId === props.folder.id }"
      role="button"
      @click="handleClick"
    >
      <span class="me-2" aria-hidden="true">
        <template v-if="loading">⏳</template>
        <template v-else-if="expanded">▾</template>
        <template v-else>▸</template>
      </span>
      <span class="flex-grow-1">{{ props.folder.name }}</span>
    </div>

    <Transition name="collapse">
      <ul v-if="expanded" class="list-unstyled ms-3">
        <!-- Subfolders -->
        <FolderTree
          v-for="child in children"
          :key="`folder-${child.id}`"
          :folder="child"
          :fetchSubfolders="props.fetchSubfolders"
          :fetchFiles="props.fetchFiles"
          :onSelect="props.onSelect"
          :selectedId="props.selectedId"
        />

        <!-- Files -->
        <li v-for="file in files" :key="`file-${file.id}`" class="px-2 py-1 small text-muted">
          📄 {{ file.name }}
        </li>

        <li
          v-if="!loading && children.length === 0 && files.length === 0"
          class="small text-muted"
        >
          No items
        </li>
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.folder-item {
  border-radius: 6px;
}
.folder-item:hover {
  background-color: #e6f7ee;
  cursor: pointer;
}

.active-folder {
  background-color: #d1f2e0; /* hijau muda */
  font-weight: bold;
  color: #0f5132; /* hijau lebih gelap */
}
</style>
