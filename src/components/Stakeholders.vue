<template>
    <div class="box">
        <div :key="stakeholder.id" v-for="stakeholder in stakeholders">
            <p>{{ stakeholder.organization }}: {{ stakeholder.name }}</p>
            <p v-show="stakeholder.requestedDate != null ? true : false">Requested: {{ stakeholder.requestedDate }}</p>      
            <p v-show="stakeholder.completedDate != null ? true : false">Completed: {{ stakeholder.completedDate }}</p>            
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stakeholders',
    props: {
        stakeholders: Array
    }
}
</script>

<style scoped lang="scss">
    .box {        
        background: $dark-color;
        color: $light-color;
        text-align: center;
        padding: 5px;
        margin: 5px;
    }
    .date {
        font-size: 80%;
    }
</style>