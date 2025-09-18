<script setup lang="ts">
import { ref, onMounted } from "vue";
import FolderTree from "./components/FolderTree.vue";
import {
  getRootFolders,
  getSubfolders,
  getFiles,
  createFolder,
  deleteFile,
  deleteFolder,
} from "./services/api";
import AddFileModal from "./components/AddFileModal.vue";

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

const selectedFolderId = ref<number | null>(null);
const selectedFolderName = ref<string>("Root");

const rootFolders = ref<Folder[]>([]);
const subfolders = ref<Folder[]>([]);
const files = ref<File[]>([]);

const showFolderModal = ref(false);
const showFileModal = ref(false);
const showDeleteModal = ref(false);
const showDeleteFolderModal = ref(false);

const newFolderName = ref("");
const deleteFileId = ref<number | null>(null);
const deleteFolderId = ref<number | null>(null);

async function showSubfolders(id: number, name?: string) {
  selectedFolderId.value = id;
  if (name) selectedFolderName.value = name;

  subfolders.value = await getSubfolders(id);
  files.value = await getFiles(id);
}

async function saveFolder() {
  if (!newFolderName.value) return;
  await createFolder(newFolderName.value, selectedFolderId.value ?? null);
  resetFolderModal();
  await refresh();
}

async function confirmDeleteFile() {
  if (!deleteFileId.value) return;
  await deleteFile(deleteFileId.value);
  resetDeleteModal();
  await refresh();
}

async function confirmDeleteFolder() {
  if (!deleteFolderId.value) return;
  await deleteFolder(deleteFolderId.value);
  resetDeleteFolderModal();
  await refresh();
}

async function refresh() {
  if (selectedFolderId.value !== null) {
    await showSubfolders(selectedFolderId.value);
  } else {
    rootFolders.value = await getRootFolders();
  }
}

function resetFolderModal() {
  newFolderName.value = "";
  showFolderModal.value = false;
}
function resetDeleteModal() {
  deleteFileId.value = null;
  showDeleteModal.value = false;
}
function resetDeleteFolderModal() {
  deleteFolderId.value = null;
  showDeleteFolderModal.value = false;
}

function getFileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

function getFileLabel(name: string) {
  const ext = getFileExtension(name);
  const map: Record<string, string> = {
    docx: "Word Document",
    doc: "Word Document",
    pdf: "PDF Document",
    xlsx: "Excel Spreadsheet",
    xls: "Excel Spreadsheet",
    pptx: "PowerPoint",
    ppt: "PowerPoint",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
  };
  return map[ext] || ext.toUpperCase();
}

function getFileIcon(name: string) {
  const ext = getFileExtension(name);
  switch (ext) {
    case "pdf":
      return "📕";
    case "doc":
    case "docx":
      return "📘";
    case "xls":
    case "xlsx":
      return "📗";
    case "ppt":
    case "pptx":
      return "📙";
    case "jpg":
    case "jpeg":
    case "png":
      return "🖼️";
    default:
      return "📄";
  }
}

onMounted(async () => {
  rootFolders.value = await getRootFolders();
});
</script>

<template>
  <div class="container-fluid bg-light vh-100 d-flex flex-column">
    <div class="p-3 bg-tosca text-white shadow-sm d-flex justify-content-between">
      <div>
        <h4 class="m-0">🏥 Health Explorer</h4>
        <small class="text-white-50">Your medical documents and records</small>
      </div>
      <div>
        <button class="btn btn-light btn-sm me-2" @click="showFolderModal = true">+ Folder</button>
        <button class="btn btn-light btn-sm" @click="showFileModal = true">+ File</button>
      </div>
    </div>

    <div class="row flex-grow-1 g-0">
      <div class="col-12 col-md-3 border-end bg-white p-3 overflow-auto">
        <h6 class="text-tosca fw-bold mb-3">Folders</h6>
        <ul class="list-unstyled">
          <FolderTree
            v-for="f in rootFolders"
            :key="f.id"
            :folder="f"
            :fetchSubfolders="getSubfolders"
            :fetchFiles="getFiles"
            :onSelect="(id, name) => showSubfolders(id, name)" 
            :selectedId="selectedFolderId"
          />
        </ul>
      </div>

      <div class="col-12 col-md-9 bg-light p-4 overflow-auto">
        <h6 class="text-tosca fw-bold mb-3">{{ selectedFolderName }}</h6>

        <TransitionGroup name="list" tag="div" class="row g-3">
          <div
            v-for="sf in subfolders"
            :key="`folder-${sf.id}`"
            class="col-12 col-sm-6 col-lg-4"
          >
            <div
              class="card h-100 shadow-sm border-0 folder-card position-relative"
              @click="showSubfolders(sf.id, sf.name)"
              style="cursor: pointer;"
            >
              <button
                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                @click.stop="() => { deleteFolderId = sf.id; showDeleteFolderModal = true; }"
              >
                ✕
              </button>
              <div class="card-body text-center">
                <div class="fs-2 mb-2">📁</div>
                <h6 class="card-title text-tosca">{{ sf.name }}</h6>
              </div>
            </div>
          </div>
          <div
            v-for="file in files"
            :key="`file-${file.id}`"
            class="col-12 col-sm-6 col-lg-4"
          >
            <div class="card h-100 shadow-sm border-0 file-card position-relative">
              <button
                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                @click="() => { deleteFileId = file.id; showDeleteModal = true; }"
              >
                ✕
              </button>
              <div class="card-body text-center">
                <div class="fs-2 mb-2">{{ getFileIcon(file.name) }}</div>
                <h6 class="card-title text-primary text-truncate">{{ file.name }}</h6>
                <small class="text-muted">{{ getFileLabel(file.name) }}</small>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <Transition name="fade">
          <div
            v-if="subfolders.length === 0 && files.length === 0"
            class="text-muted mt-5 text-center"
          >
            <p>No contents available</p>
          </div>
        </Transition>
      </div>
    </div>

    <div class="modal fade show" v-if="showFolderModal" style="display:block;" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Folder</h5>
            <button type="button" class="btn-close" @click="resetFolderModal"></button>
          </div>
          <div class="modal-body">
            <input v-model="newFolderName" type="text" class="form-control" placeholder="Folder name" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="resetFolderModal">Cancel</button>
            <button class="btn btn-tosca" @click="saveFolder">Save</button>
          </div>
        </div>
      </div>
    </div>

    <AddFileModal
      :folderId="selectedFolderId"
      :show="showFileModal"
      @close="showFileModal = false"
      @uploaded="() => { if (selectedFolderId) showSubfolders(selectedFolderId) }"
    />

    <div class="modal fade show" v-if="showDeleteModal" style="display:block;" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete File</h5>
            <button type="button" class="btn-close" @click="resetDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this file?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="resetDeleteModal">Cancel</button>
            <button class="btn btn-danger" @click="confirmDeleteFile">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade show" v-if="showDeleteFolderModal" style="display:block;" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Folder</h5>
            <button type="button" class="btn-close" @click="resetDeleteFolderModal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this folder? (must be empty)</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="resetDeleteFolderModal">Cancel</button>
            <button class="btn btn-danger" @click="confirmDeleteFolder">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Warna utama Tosca === */
.bg-tosca {
  background: linear-gradient(90deg, #20c997, #17a2b8) !important;
}
.text-tosca {
  color: #20c997 !important;
}
.btn-tosca {
  background-color: #20c997;
  border: none;
  color: white;
}
.btn-tosca:hover {
  background-color: #17a2b8;
  color: white;
}

/* Card Hover Effect */
.folder-card,
.file-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.folder-card:hover,
.file-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(32, 201, 151, 0.3);
}

/* Animasi grid */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.list-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Animasi empty state */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal backdrop */
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
