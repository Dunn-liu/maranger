<template>
  <div class="pass_strength w-full">
    <el-row style="align-items: center">
      密码强度：
      <el-col :span="4" :offset="1">
        <el-progress :percentage="onePercentage" :color="oneCustomColors" :format="
          () => {
            return '';
          }
        " :stroke-width="3"></el-progress>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-progress :percentage="twoPercentage" :color="twoCustomColors" :format="
          () => {
            return '';
          }
        " :stroke-width="3"></el-progress>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-progress :percentage="ThreePercentage" :color="ThreeCustomColors" :format="
          () => {
            return '';
          }
        " :stroke-width="3"></el-progress>
      </el-col>
      <el-col :span="2" :offset="1" style="line-height: 15px">
        {{ content }}
      </el-col>
    </el-row>
  </div>
</template>
 
<script>
import { defineComponent, toRefs, reactive, watch } from "vue";
export default defineComponent({
  name: "PasswordStrength",
  props: ["password"],
  setup(props) {
    console.log(props);
    const state = reactive({
      content: "",
      onePercentage: 0,
      twoPercentage: 0,
      ThreePercentage: 0,
      oneCustomColors: [{ color: "#f56c6c", percentage: 100 }],
      twoCustomColors: [{ color: "#e6a23c", percentage: 100 }],
      ThreeCustomColors: [{ color: "#67c23a", percentage: 100 }],
    });
    const checkPasswordStrength = (value) => {
      let mode = 0;
      //正则表达式验证符合要求的
      if (value.length < 1) return mode;
      if (/\d/.test(value)) mode++; //数字
      if (/[a-z]/.test(value)) mode++; //小写
      if (/[A-Z]/.test(value)) mode++; //大写
      if (/\W/.test(value)) mode++; //特殊字符
      return mode;
    };

    watch(
      () => props.password,
      (newVal) => {
        const mode = checkPasswordStrength(newVal);
        //逻辑处理
        switch (mode) {
          //初始化状态
          case 0:
            state.content = "";
            state.onePercentage = 0;
            state.twoPercentage = 0;
            state.ThreePercentage = 0;
            break;
          case 1:
            state.content = "弱";
            state.onePercentage = 100;
            state.twoPercentage = 0;
            state.ThreePercentage = 0;
            break;
          case 2:
            state.content = "中";
            state.onePercentage = 100;
            state.twoPercentage = 100;
            state.ThreePercentage = 0;
            break;
          case 3:
            state.content = "中";
            state.onePercentage = 100;
            state.twoPercentage = 100;
            state.ThreePercentage = 0;
            break;
          default:
            state.content = "高";
            state.onePercentage = 100;
            state.twoPercentage = 100;
            state.ThreePercentage = 100;
            break;
        }
      }
    );
    return {
      ...toRefs(state),
    };
  },
});
</script>
 
<style>
.pass_strength {
  color: #606266;
}

.el-progress__text {
  display: none;
}

.el-progress-bar {
  padding-right: 0px;
  margin: 0px;
}
</style>