<template>  
  <div>
    <p>ddddddddddddddddddd</p>
    <Submittals :submittals="submittals" @delete-submittal="deleteSubmittal" @toggle-priority="togglePriority" @update-submittal="updateSubmittal" @dynamic-query="getDynamicQuery" />
  </div>
</template>

<script>
import Submittals from '@/components/Submittals.vue'

export default {
  name: "Home",

  components: {
    Submittals
  },
};
</script>
