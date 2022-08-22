<template>
  <div>
    <!-- <div
      :class="[submittal.priority ? 'priority' : '', 'submittal']"
      @dblclick="togglePriority(submittal.id)"
    >
      <h3>
        {{ submittal.submittalID }}
        <i @click="onDelete(submittal.id)" class="fas fa-times"></i>
      </h3>
      <p>{{ submittal.needDate }}</p>
    </div> -->

    <v-card>
      
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Submittal",
  props: {
    submittal: Object,
  },
  methods: {
    onDelete(id) {
      this.$emit("delete-submittal", id);
    },
    togglePriority(id) {
      this.$emit("toggle-priority", id);
    },
  },
};
</script>

<style scoped>
.fas {
  color: red;
}

.submittal {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

.submittal.priority {
  border-left: 5px solid maroon;
}

.submittal h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
