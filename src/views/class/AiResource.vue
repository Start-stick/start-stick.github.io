<script setup>
import ChatDialog from "@/components/ChatDialog.vue";
import { ref } from "vue";
// import { useMessagesStore } from "@/stores/messages";

// const messagesStore=useMessagesStore()

const ask=ref('生成教案')

</script>

<template>
    <div>
        资源助手
        <ChatDialog :ask="ask"></ChatDialog>    
    </div>
</template>

<style lang="scss" scoped>

</style>