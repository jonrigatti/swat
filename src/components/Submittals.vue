<template>
    <div>
        <div :key="submittal.id" v-for="submittal in submittals">
            <Submittal :submittal="submittal" @delete-submittal="$emit('delete-submittal', submittal.id)" @toggle-priority="$emit('toggle-priority', submittal.id)" />
        </div>
    </div>
</template>

<script>
    import Submittal from './Submittal.vue'

    export default {
        name: 'Submittals',
        props: {
            submittals: Array
        },
        components: {
            Submittal
        },
        emits: ['delete-submittal', 'toggle-priority']
    }
</script>