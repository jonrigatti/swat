<template>
    <header>
        <h1>{{ title }}</h1>
        <Button
            @btn-click="$emit('toggle-add-submittal')"            
            :text="showAddSubmittal ? 'Close' : 'Add Submittal'"
            :color="showAddSubmittal ? 'red' : 'purple'"
        />
    </header>
</template>

<script>
    import Button from './Button'

    export default {
        name: 'Header',
        props: {
            title: String,
            showAddSubmittal: Boolean
        },
        components: {
            Button
        }
    }
</script>

<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>
