<template>
    <div class="pagination" v-if="pageData.last_page > 1 && !loading">
        <el-pagination background layout="prev, pager, next" :pager-count="5" :page-count="pageData.last_page" @current-change="changePage" />
        <!-- <button class="pagination-btn" :disabled="pageData.current_page === 1" @click="changePage(pageData.current_page - 1)" >‹</button>
        <button
            v-for="page in pageData.last_page"
            :key="page"
            class="pagination-btn"
            :class="{ active: pageData.current_page == page }"
            @click="changePage(page)"
        >
            {{ page }}
        </button>
        <button class="pagination-btn" :disabled="pageData.current_page === pageData.last_page" @click="changePage(pageData.current_page + 1)">›</button>
        <span class="pagination-info">共 {{ pageData.total }} 个</span> -->
    </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';

// 定义 props
const props = defineProps({
    PaginationData: {
        type: Object
    },
    source: {
        type: String
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const pageData = ref({});
const currentPage = ref(1);
watch(
    () => props.PaginationData,
    (newValue) => {
        pageData.value = newValue;
    }
)
console.log('pageDatapageData',pageData)
watch(
    () => props.source,
    (newValue) => {
        currentPage.value = 1;
    }
)

// 定义 emits
const emit = defineEmits(['change'])

watch(
    () => currentPage.value,
    (newValue) => {
        emit('change', newValue)
    }
)

// 定义方法
function changePage(page) {
    currentPage.value = page
}


</script>

<style lang="css" scoped>
/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 48px;
    flex-wrap: wrap;
}
.pagination-btn {
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
    min-width: 36px !important;
}
.pagination-btn .active {
    background: #6bb142;
    border-color: #6bb142;
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.pagination-btn:hover {
    border-color: #6bb142;
}


.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-info {
    padding: 0 16px;
    font-size: 14px;
    color: #94a3b8;
}
@media (max-width: 768px) {
    .pagination {
        margin-top: 32px;
        gap: 6px;
    }
    .pagination-btn {
        padding: 8px 14px;
        font-size: 13px;
    }
}

</style>