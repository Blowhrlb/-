<template>
  <div class="plans-page">
    <!-- Page Header -->
    <PageHeader
      title="求职套餐"
      description="根据您的求职需求，我们提供多种专业套餐选择，覆盖校招、社招全场景，助您高效拿Offer"
      bgImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=80"
      height="450px"
    />

    <!-- Plans Section -->
    <section class="plans-section-full">
      <div class="container">
        <!-- Tab切换 -->
        <div class="plans-tabs-full">
          <button
            class="plans-tab-full"
            :class="{ active: currentTab === 'campus' }"
            @click="switchTab('campus')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            校招套餐
          </button>
          <button
            class="plans-tab-full"
            :class="{ active: currentTab === 'social' }"
            @click="switchTab('social')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            社招套餐
          </button>
        </div>

        <div class="plans-container">
          <div class="plans-page active">
            <div
              v-for="plan in currentPlans"
              :key="plan.name"
              class="plan-card"
            >
              <div v-if="plan.hot" class="plan-badge hot">{{ plan.badge }}</div>
              <div v-else class="plan-badge">{{ plan.badge }}</div>
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <p>{{ plan.description }}</p>
              </div>
              <div class="plan-suit">
                <span class="suit-label">适合：</span>
                <span class="suit-text">{{ plan.suitable }}</span>
              </div>
              <div class="plan-price">
                <span class="price">{{ plan.price }}</span>
                <span class="period">{{ plan.original_price }}</span>
              </div>
              <ul class="plan-features">
                <li v-for="feature in plan.features" :key="feature">
                  <span class="icon">✓</span>
                  {{ feature }}
                </li>
              </ul>
              <p v-if="plan.note" class="plan-note">{{ plan.note }}</p>
              <button class="btn plan-btn" @click="showPlanDetail(plan)">
                立即咨询
              </button>
            </div>
          </div>

          <!-- 分页组件 -->
          <PaginationPage v-model:PaginationData="PaginationData" :loading="loading" :source="currentTab" @change="changePage"></PaginationPage>
        </div>
      </div>
    </section>

    <!-- Plan Modal -->
    <PlanModal v-model:modelValue="modalVisible" ref="planModalRef" @submit="handlePlanSubmit"></PlanModal>

    <!-- Payment Modal -->
    <PaymentModal
      :show="showPaymentModal"
      :order="{ id: pendingOrderId, amount: pendingOrderAmount }"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PaginationPage from '@/components/common/PageModal.vue'
import PlanModal from '@/components/PlanModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'

import api from '@/api'

// 加载状态
const loading = ref(false)

// 套餐数据
const campusPlans = ref<any[]>([])
const socialPlans = ref<any[]>([])

const currentTab = ref<'campus' | 'social'>('campus')
const currentPage = ref(1)
const itemsPerPage = 10
const pagination = ref<any>({})

const currentPlans = computed(() => {
  return currentTab.value === 'campus' ? campusPlans.value : socialPlans.value
})

// 分页数据
const PaginationData = ref({});

// 获取套餐数据
async function fetchPlans() {
  loading.value = true
  try {
    let params = {
      page: currentPage.value,
      per_page: itemsPerPage,
      type: currentTab.value === 'campus' ? 'campus' : 'social'
    }
    const res:any = await api.planList(params);
    if (res.data && res.data.length > 0) {
      pagination.value = res.pagination;
      if (currentTab.value === 'campus') {
        campusPlans.value = res.data;
        PaginationData.value = res.pagination;
      } else {
        socialPlans.value = res.data;
        PaginationData.value = res.pagination;
      }
    } else {
      console.log('no data')
    }
  } catch (error) {
    console.log('no data', error)
  } finally {
    loading.value = false
  }
}


function switchTab(tab: 'campus' | 'social') {
  currentTab.value = tab
  currentPage.value = 1;
  fetchPlans()
}

function changePage(page: number) {
  currentPage.value = page;
  fetchPlans()
}

// PlanModal ref
const planModalRef = ref<InstanceType<typeof PlanModal> | null>(null)
const modalVisible = ref(false);

// 支付弹窗相关
const showPaymentModal = ref(false)
const pendingOrderId = ref<number>(0)
const pendingOrderAmount = ref<number>(0)

function showPlanDetail(plan: any) {
  modalVisible.value = true;
  planModalRef.value?.openPlanModal(plan.name, plan.price, plan.id)
}

// PlanModal 提交成功后调用支付
async function handlePlanSubmit(data: { formData: any; orderId: number; amount: string | number }) {
  // 保存订单信息
  pendingOrderId.value = data.orderId
  pendingOrderAmount.value = Number(data.amount)
  // 关闭弹窗
  modalVisible.value = false
  // 打开支付弹窗
  showPaymentModal.value = true
}

// 关闭支付弹窗
function closePaymentModal() {
  showPaymentModal.value = false
}

onMounted(async () => {
  await fetchPlans()
  const params = new URLSearchParams(window.location.search)
  if (params.get('type') === 'social') {
    switchTab('social')
  }
})
</script>

<style scoped>
  @import "@/assets/styles/PlansView.css";
</style>

