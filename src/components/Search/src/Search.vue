<script setup lang="ts">
import { Form } from '@/components/Form'
import { PropType, computed, unref, ref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElButton, ElIcon } from 'element-plus'
import { useForm } from '@/hooks/useForm'
import { findIndex } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { FormSchema } from '@/types/form'
import { Search, RefreshRight, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(false),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'reset', 'update:model'])

const visible = ref(true)

const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema)
  if (props.expand && props.expandField && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === props.expandField)
    if (index > -1) {
      const length = schema.length
      schema.splice(index + 1, length)
    }
  }
  if (props.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px'
        }
      }
    ])
  }
  return schema
})

const { register, elFormRef, methods } = useForm({
  model: props.model || {}
})
defineExpose({
  getModel: async () => {
    const { getFormData } = methods
    return await getFormData()
  }
})
const search = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      const { getFormData } = methods
      const model = await getFormData()
      emit('search', model)
    }
  })
}

const reset = async () => {
  unref(elFormRef)?.resetFields()
  const { getFormData } = methods
  const model = await getFormData()
  emit('update:model', model)
  emit('reset', model)
}

const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as 'left' | 'center' | 'right'
  }
})

const setVisible = () => {
  unref(elFormRef)?.resetFields()
  visible.value = !unref(visible)
}
</script>

<template>
  <Form :is-custom="false" :label-width="labelWidth" hide-required-asterisk :inline="inline" :is-col="isCol"
    :schema="newSchema" @register="register">
    <template #action>
      <div v-if="layout === 'inline'">
        <ElButton v-if="showSearch" type="primary" @click="search">
          <ElIcon class="mr-5px">
            <Search />
          </ElIcon>
          查询
        </ElButton>
        <ElButton v-if="showReset" @click="reset">
          <ElIcon class="mr-5px">
            <RefreshRight />
          </ElIcon>
          重置
        </ElButton>
        <ElButton v-if="expand" text @click="setVisible">
          {{ visible ? '收起' : '展开' }}
          <ElIcon class="mr-5px">
            <ArrowUp v-if="visible" />
            <ArrowDown v-else />
          </ElIcon>
        </ElButton>
      </div>
    </template>
  </Form>

  <template v-if="layout === 'bottom'">
    <div :style="bottonButtonStyle">
      <ElButton v-if="showSearch" type="primary" @click="search">
        <ElIcon class="mr-5px">
          <Search />
        </ElIcon>
        查询
      </ElButton>
      <ElButton v-if="showReset" @click="reset">
        <ElIcon class="mr-5px">
          <RefreshRight />
        </ElIcon>
        重置
      </ElButton>
      <ElButton v-if="expand" text @click="setVisible">
        {{ visible ? '收起' : '展开' }}
        <ElIcon class="mr-5px">
          <ArrowUp v-if="visible" />
          <ArrowDown v-else />
        </ElIcon>
      </ElButton>
    </div>
  </template>
</template>
