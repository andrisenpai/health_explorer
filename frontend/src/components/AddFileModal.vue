<script setup lang="ts">
import { ref } from "vue";
import { uploadFile } from "../services/api";

const props = defineProps<{
  folderId: number | null;
  show: boolean;
}>();
const emits = defineEmits(["close", "uploaded"]);

const selectedFile = ref<File | null>(null);

async function handleUpload() {
  if (!props.folderId || !selectedFile.value) return;

  try {
    await uploadFile(props.folderId, selectedFile.value);
    emits("uploaded"); // trigger refresh di parent
    emits("close");
    selectedFile.value = null;
  } catch (err: any) {
    alert("Upload gagal: " + err.message);
  }
}
</script>

<template>
  <div class="modal fade show" v-if="show" style="display:block;" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload File</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <input type="file" class="form-control" @change="(e: any) => selectedFile = e.target.files[0]" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button class="btn btn-success" @click="handleUpload">Upload</button>
        </div>
      </div>
    </div>
  </div>
</template>
