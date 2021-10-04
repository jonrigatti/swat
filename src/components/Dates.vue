<template>
    <div class="box">
        <p class="date">{{ submittal.needDate }}</p>
        <p class="date">{{ submittal.receivedDate }}</p>
        <p class="date">{{ submittal.dispositionDate }}</p>
    </div>
</template>

<script>
export default {
    name: 'Dates',
    props: {
        submittal: Object
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