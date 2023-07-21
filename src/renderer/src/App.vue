<script setup lang="ts">
import { isObject } from '@renderer/utils';
import useCounter from '@renderer/store/count';

// @ts-ignore
import Edit from '~icons/ep/edit';

const counter = useCounter();

const cssss = ref(1);

const handleTest = () => {
  console.log('test');
  console.log(isObject(counter));
  console.log(counter);
  console.log(cssss.value);
};

window.electron.ipcRenderer.on('pong', (_, arg) => {
  console.log(arg);
  ElMessage({
    message: arg,
    type: 'success'
  });
});

const sendTest = () => {
  window.electron.ipcRenderer.send('ping', 'ping main');
};
</script>

<template>
  <Versions />
  <el-input v-model="counter.count"></el-input>
  <el-button @click="counter.increment">Increment</el-button>
  <el-button @click="counter.decrement">Decrement</el-button>
  <el-button :icon="Edit" @click="handleTest">test</el-button>
  <icon-custom-copy />
  <br />
  <el-icon>
    <icon-ep-edit />
  </el-icon>
  <icon-ep-menu />
  <div>{{ $t('common.feedback') }}</div>
  <el-button @click="sendTest">ping main</el-button>
  <router-link to="/home">home</router-link>
  <router-link class="ml-4" to="/about">about</router-link>
  <router-view></router-view>
</template>

<style lang="less" scoped></style>
